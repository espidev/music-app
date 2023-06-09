import pkg from 'pg';
import { parseFile, selectCover } from "music-metadata";
import FormData from 'form-data';
import { createReadStream } from 'fs';
import axios from 'axios';
import tmp from 'tmp';
import { appendFile } from 'fs/promises';

export async function importAudioFile(dbClient: pkg.Client, accountUuid: string, filePath: string, fileStoreUrl: string) {
  const metadata = await parseFile(filePath);

  const cover = selectCover(metadata.common.picture);
  
  const albumName = metadata.common.album;
  const albumArtist = metadata.common.albumartist;
  const albumTrackNum = metadata.common.track.no;
  const albumDiscNum = metadata.common.disk.no; // TODO
  
  // TODO metadata.common.artists?
  const artistDisplayName = metadata.common.artist;

  const genres = metadata.common.genre;
  
  const trackName = metadata.common.title;
  const trackYear = metadata.common.year;
  const trackDuration = metadata.format.duration;

  try {
    await dbClient.query('BEGIN');

    // insert track first
    const res = await dbClient.query(`
      INSERT INTO track(
        name, 
        account_uuid, 
        artist_display_name,
        uploaded_on,
        create_year,
        audio_length
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `, [trackName, accountUuid, artistDisplayName, new Date().toISOString(), trackYear, Math.round(trackDuration!)]);

    const trackId = res.rows[0].id;

    if (albumArtist) {
      // insert artist if they don't exist
      await dbClient.query(`
        INSERT INTO artist(name, account_uuid) VALUES ($1, $2) 
          ON CONFLICT DO NOTHING;
      `, [albumArtist, accountUuid]);

      // insert artist relationship
      await dbClient.query(`
        INSERT INTO track_to_artist(account_uuid, track_id, artist_id) 
          VALUES (
            $1, 
            $2, 
            (SELECT id FROM artist WHERE name = $3 AND account_uuid = $1)
          )
      `, [accountUuid, trackId, albumArtist]);
    }

    if (albumName) {
      // insert album if they don't exist
      await dbClient.query(`
        INSERT INTO album(name, account_uuid, album_artist) VALUES ($1, $2, $3)
          ON CONFLICT DO NOTHING
      `, [albumName, accountUuid, albumArtist]);

      // insert album relationship
      await dbClient.query(`
        INSERT INTO track_to_album(account_uuid, track_id, album_id, position)
          VALUES (
            $1,
            $2,
            (SELECT id FROM album WHERE name = $3 AND account_uuid = $1),
            $4
          )
      `, [accountUuid, trackId, albumName, albumTrackNum]);
    }

    if (albumName && albumArtist) {
      // insert album-artist relationship
      //TODO use album id and artist id, because there can be multiple albums with the same name
      await dbClient.query(`
        INSERT INTO album_to_artist(account_uuid, album_id, artist_id)
          VALUES (
            $1,
            (SELECT id FROM album WHERE name = $2 AND account_uuid = $1),
            (SELECT id FROM artist WHERE name = $3 AND account_uuid = $1)
          )
          ON CONFLICT DO NOTHING
      `, [accountUuid, albumName, albumArtist]);
    }

    if (genres) {

      for (const genre of genres) {
        // insert genre if they don't exist
        await dbClient.query(`
          INSERT INTO genre(name, account_uuid) VALUES ($1, $2)
            ON CONFLICT DO NOTHING
        `, [genre, accountUuid]);

        // insert genre relationship
        await dbClient.query(`
          INSERT INTO track_to_genre(account_uuid, track_id, genre_id)
            VALUES (
              $1,
              $2,
              (SELECT id FROM genre WHERE name = $3 AND account_uuid = $1)
            )
        `, [accountUuid, trackId, genre]);
      }
    }

    
    // upload cover to filestore
    if (cover) {
      // temporarily write to disk
      const tmpobj = tmp.fileSync();
      await appendFile(tmpobj.name, cover.data);

      const formData = new FormData();
      formData.append('file', createReadStream(tmpobj.name));
      
      await axios.post(`${fileStoreUrl}/track-thumbnail/${trackId}`, formData, { headers: formData.getHeaders() });
      
      tmpobj.removeCallback();
    }
    
    // upload file to filestore
    {
      const formData = new FormData();
      formData.append('file', createReadStream(filePath));
      
      await axios.post(`${fileStoreUrl}/track/${trackId}`, formData, { headers: formData.getHeaders() });
    }
    
    await dbClient.query('COMMIT');

  } catch (e) {
    await dbClient.query('ROLLBACK');
    throw e;
  }

  dbClient.end();
}