import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { DBArtist, getAPIArtist } from "@/util/models/artist";
import { getAPIAlbum } from "@/util/models/album";
import { getAPITrack } from "@/util/models/track";
import { getAPIGenre } from "@/util/models/genre";
import { NextResponse } from "next/server";
import { getAPIPlaylist } from "@/util/models/playlist";

// GET /api/artist/[artistId]/tracks
// get an artist's track list

export async function GET(request: Request, { params }: { params: { artistId: string } }) {
  const artistId = params.artistId;
  
  // check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const conn = await getDB();

  const artistRes = await conn.query(`SELECT * FROM artist WHERE artist.id = $1 LIMIT 1`, [artistId]);
  if (artistRes.rowCount < 1) {
    return NextResponse.json({ error: "artist not found" }, { status: 404 });
  }

  const dbArtist = artistRes.rows[0] as DBArtist;

  if (tokenUuid !== dbArtist.account_uuid) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const artist: any = getAPIArtist(artistRes.rows[0]);

  const trackRes = await conn.query(`
    SELECT 
      t.*,
      JSON_AGG(artist.*) as artists, 
      JSON_AGG(album.*) as albums,
      JSON_AGG(genre.*) as genres,
      JSON_AGG(playlist.*) as playlists
      FROM track_to_artist
      INNER JOIN track as t ON t.id = track_to_artist.track_id
      LEFT OUTER JOIN track_to_album ON t.id = track_to_album.track_id
      LEFT OUTER JOIN album ON track_to_album.album_id = album.id
      LEFT OUTER JOIN artist ON track_to_artist.artist_id = artist.id
      LEFT OUTER JOIN track_to_genre ON t.id = track_to_genre.track_id
      LEFT OUTER JOIN genre ON track_to_genre.genre_id = genre.id
      FULL OUTER JOIN playlist_tracks ON t.id = playlist_tracks.track_id
      FULL OUTER JOIN playlist ON playlist_tracks.playlist_id = playlist.id
      WHERE track_to_artist.artist_id = $1
      GROUP BY t.id, track_to_album.album_id
      ORDER BY track_to_album.album_id ASC
  `, [artist.id]);

  await conn.end();

  const tracks = trackRes.rows.map(track => {
    const apiTrack: any = getAPITrack(track);
    apiTrack.albums = track.albums.filter((album: any) => album).map((album: any) => getAPIAlbum(album));
    apiTrack.artists = track.artists.filter((artist: any) => artist).map((artist: any) => getAPIArtist(artist));
    apiTrack.genres = track.genres.filter((genre: any) => genre).map((genre: any) => getAPIGenre(genre));
    apiTrack.playlists = track.playlists.filter((playlist: any) => playlist).map((playlist: any) => getAPIPlaylist(playlist));

    return apiTrack;
  });

  return NextResponse.json(tracks, { status: 200 });
}
