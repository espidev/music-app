import { checkAuthenticated } from "@/util/api";
import { FAVOURITES_PLAYLIST_NAME } from "@/util/constants";
import { getDB } from "@/util/db";
import { getAPIAlbum } from "@/util/models/album";
import { getAPIArtist } from "@/util/models/artist";
import { getAPIGenre } from "@/util/models/genre";
import { DBPlaylist, getAPIPlaylist } from "@/util/models/playlist";
import { getAPITrack } from "@/util/models/track";
import { NextResponse } from "next/server";

// GET /api/collection/favourites
// get a user's favourites track list

export async function GET(request: Request, { params }: { params: { accountUuid: string } }) {
  const accountUuid = params.accountUuid;
  
  // check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null || tokenUuid !== accountUuid) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const conn = await getDB();

  const playlistRes = await conn.query(`
    SELECT * FROM playlist WHERE account_uuid = $1 AND name = $2 LIMIT 1
    `, [accountUuid, FAVOURITES_PLAYLIST_NAME]);

  if (playlistRes.rowCount < 1) {
    await conn.end();
    return NextResponse.json([], { status: 200 });
  }

  const dbPlaylist = playlistRes.rows[0] as DBPlaylist;

  if (tokenUuid !== dbPlaylist.account_uuid) {
    await conn.end();
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const trackRes = await conn.query(`
    SELECT 
      t.*,
      playlist_tracks.position as playlist_position,
      JSON_AGG(artist.*) as artists,
      JSON_AGG(album.*) as albums,
      JSON_AGG(genre.*) as genres,
      JSON_AGG(playlist.*) as playlists
      FROM playlist_tracks
      INNER JOIN track as t ON t.id = playlist_tracks.track_id
      LEFT OUTER JOIN track_to_artist ON t.id = track_to_artist.track_id
      LEFT OUTER JOIN artist ON track_to_artist.artist_id = artist.id
      LEFT OUTER JOIN track_to_album ON t.id = track_to_album.track_id
      LEFT OUTER JOIN album ON track_to_album.album_id = album.id
      LEFT OUTER JOIN track_to_genre ON t.id = track_to_genre.track_id
      LEFT OUTER JOIN genre ON track_to_genre.genre_id = genre.id
      FULL OUTER JOIN playlist_tracks AS pt2 ON t.id = pt2.track_id
      FULL OUTER JOIN playlist ON pt2.playlist_id = playlist.id
      WHERE playlist_tracks.playlist_id = $1
      GROUP BY t.id, playlist_tracks.position
      ORDER BY playlist_tracks.position ASC
  `, [dbPlaylist.id]);

  await conn.end();

  const tracks = trackRes.rows.map(track => {
    const apiTrack: any = getAPITrack(track);
    apiTrack.albums = track.albums.filter((album: any) => album).map((album: any) => getAPIAlbum(album));
    apiTrack.artists = track.artists.filter((artist: any) => artist).map((artist: any) => getAPIArtist(artist));
    apiTrack.genres = track.genres.filter((genre: any) => genre).map((genre: any) => getAPIGenre(genre));
    apiTrack.playlists = track.playlists.filter((playlist: any) => playlist).map((playlist: any) => getAPIPlaylist(playlist));
    apiTrack.playlist_position = track.playlist_position;

    return apiTrack;
  });

  return NextResponse.json(tracks, { status: 200 });
}
