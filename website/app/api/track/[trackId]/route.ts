import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { getAPIArtist } from "@/util/models/artist";
import { getAPIAlbum } from "@/util/models/album";
import { DBTrack, getAPITrack } from "@/util/models/track";
import { getAPIGenre } from "@/util/models/genre";
import { NextResponse } from "next/server";
import { getAPIPlaylist } from "@/util/models/playlist";

// GET /api/track/[trackId]
// get a track's information

export async function GET(request: Request, { params }: { params: { trackId: string } }) {
  const trackId = params.trackId;
  
  // check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const conn = await getDB();

  const tRes = await conn.query(`SELECT * FROM track WHERE id = $1 LIMIT 1`, [trackId]);
  if (tRes.rowCount < 1) {
    return NextResponse.json({ error: "track not found" }, { status: 404 });
  }

  const dbArtist = tRes.rows[0] as DBTrack;

  if (tokenUuid !== dbArtist.account_uuid) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const trackRes = await conn.query(`
    SELECT 
      t.*,
      JSON_AGG(artist.*) as artists, 
      JSON_AGG(album.*) as albums,
      JSON_AGG(genre.*) as genres,
      JSON_AGG(playlist.*) as playlists
      FROM track as t
      LEFT OUTER JOIN track_to_album ON t.id = track_to_album.track_id
      LEFT OUTER JOIN album ON track_to_album.album_id = album.id
      LEFT OUTER JOIN track_to_artist ON t.id = track_to_artist.track_id
      LEFT OUTER JOIN artist ON track_to_artist.artist_id = artist.id
      LEFT OUTER JOIN track_to_genre ON t.id = track_to_genre.track_id
      LEFT OUTER JOIN genre ON track_to_genre.genre_id = genre.id
      FULL OUTER JOIN playlist_tracks ON t.id = playlist_tracks.track_id
      FULL OUTER JOIN playlist ON playlist_tracks.playlist_id = playlist.id
      WHERE t.id = $1
      GROUP BY t.id
  `, [trackId]);

  await conn.end();

  if (trackRes.rowCount < 1) {
    return NextResponse.json({ error: "track not found" }, { status: 404 });
  }

  const track = trackRes.rows[0];

  const apiTrack: any = getAPITrack(track);
  apiTrack.albums = track.albums.filter((album: any) => album).map((album: any) => getAPIAlbum(album));
  apiTrack.artists = track.artists.filter((artist: any) => artist).map((artist: any) => getAPIArtist(artist));
  apiTrack.genres = track.genres.filter((genre: any) => genre).map((genre: any) => getAPIGenre(genre));
  apiTrack.playlists = track.playlists.filter((playlist: any) => playlist).map((playlist: any) => getAPIPlaylist(playlist));

  return NextResponse.json(apiTrack, { status: 200 });
}
