import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { NextResponse } from "next/server";
import { getAPITrack } from "@/util/models/track";
import { getAPIAlbum } from "@/util/models/album";
import { getAPIArtist } from "@/util/models/artist";
import { getAPIGenre } from "@/util/models/genre";

// GET /collections/[accountUuid]/search
// Search for tracks

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

  // get url parameter
  const query = request.url.split("?")[1];
  const p = new URLSearchParams(query);
  const search = p.get("q");

  // fetch the list of tracks
  const trackRes = await conn.query(
    `
    SELECT t.*, 
      JSON_AGG(artist.*) as artists, 
      JSON_AGG(album.*) as albums,
      JSON_AGG(genre.*) as genres
    FROM track as t
      LEFT OUTER JOIN track_to_artist ON t.id = track_to_artist.track_id
      LEFT OUTER JOIN artist ON track_to_artist.artist_id = artist.id
      LEFT OUTER JOIN track_to_album ON t.id = track_to_album.track_id
      LEFT OUTER JOIN album ON track_to_album.album_id = album.id
      LEFT OUTER JOIN track_to_genre ON t.id = track_to_genre.track_id
      LEFT OUTER JOIN genre ON track_to_genre.genre_id = genre.id
      WHERE t.account_uuid = $1::text AND (
        t.name ILIKE $2 OR
        t.artist_display_name ILIKE $2 OR
        t.create_year::text ILIKE $2 OR
        album.name ILIKE $2 OR
        genre.name ILIKE $2
      )
      GROUP BY t.id
      ORDER BY t.name ASC
    `, [accountUuid, `%${search}%`]);

  await conn.end();
  
  const tracks = trackRes.rows.map(track => {
    const apiTrack: any = getAPITrack(track);
    apiTrack.albums = track.albums.filter((album: any) => album).map((album: any) => getAPIAlbum(album));
    apiTrack.artists = track.artists.filter((artist: any) => artist).map((artist: any) => getAPIArtist(artist));
    apiTrack.genres = track.genres.filter((genre: any) => genre).map((genre: any) => getAPIGenre(genre));
    return apiTrack;
  });

  return NextResponse.json(tracks, { status: 200 });
}
