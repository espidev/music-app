import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { NextResponse } from "next/server";
import { getAPITrack } from "@/util/models/track";
import { getAPIAlbum } from "@/util/models/album";
import { getAPIArtist } from "@/util/models/artist";
import { getAPIGenre } from "@/util/models/genre";
import { getAPIPlaylist } from "@/util/models/playlist";

// GET /collections/[accountUuid]/hotcharts
// get hot chart information

export async function GET(request: Request, { params }: { params: { accountUuid: string } }) {
  const accountUuid = params.accountUuid;
  
  // check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null || tokenUuid !== accountUuid) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const conn = await getDB();

  // query db for account
  const accountRes = await conn.query("SELECT * FROM account WHERE uuid = $1::text", [accountUuid]);
  if (accountRes.rowCount < 1) {
    return NextResponse.json({ error: "account not found" }, { status: 404 });
  }

  // fetch top artists
  const artistRes = await conn.query(`
    SELECT artist.*, 
      SUM(track.num_of_times_played) AS total_plays
      FROM track
      INNER JOIN track_to_artist ON track.id = track_to_artist.track_id
      INNER JOIN artist ON track_to_artist.artist_id = artist.id
      WHERE track.account_uuid = $1
      GROUP BY artist.id
      ORDER BY total_plays DESC
      LIMIT 10
  `, [tokenUuid]);

  const artists = artistRes.rows.map(artist => {
    const apiArtist: any = getAPIArtist(artist);
    apiArtist.total_plays = artist.total_plays;
    
    return apiArtist;
  })

  // fetch the list of tracks
  const trackRes = await conn.query(
    `
    SELECT t.*, 
      JSON_AGG(artist.*) as artists, 
      JSON_AGG(album.*) as albums,
      JSON_AGG(genre.*) as genres,
      JSON_AGG(playlist.*) as playlists
    FROM track as t
      LEFT OUTER JOIN track_to_artist ON t.id = track_to_artist.track_id
      LEFT OUTER JOIN artist ON track_to_artist.artist_id = artist.id
      LEFT OUTER JOIN track_to_album ON t.id = track_to_album.track_id
      LEFT OUTER JOIN album ON track_to_album.album_id = album.id
      LEFT OUTER JOIN track_to_genre ON t.id = track_to_genre.track_id
      LEFT OUTER JOIN genre ON track_to_genre.genre_id = genre.id
      FULL OUTER JOIN playlist_tracks ON t.id = playlist_tracks.track_id
      FULL OUTER JOIN playlist ON playlist_tracks.playlist_id = playlist.id
      WHERE t.account_uuid = $1::text 
      GROUP BY t.id
      ORDER BY t.num_of_times_played DESC
      LIMIT 10
    `, [accountUuid]);

  await conn.end();
  
  const tracks = trackRes.rows.map(track => {
    const apiTrack: any = getAPITrack(track);
    apiTrack.albums = track.albums.filter((album: any) => album).map((album: any) => getAPIAlbum(album));
    apiTrack.artists = track.artists.filter((artist: any) => artist).map((artist: any) => getAPIArtist(artist));
    apiTrack.genres = track.genres.filter((genre: any) => genre).map((genre: any) => getAPIGenre(genre));
    apiTrack.playlists = track.playlists.filter((playlist: any) => playlist).map((playlist: any) => getAPIPlaylist(playlist));

    return apiTrack;
  });

  return NextResponse.json({
    top_artists: artists,
    top_tracks: tracks,
  }, { status: 200 });
}
