import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { NextResponse } from "next/server";

// GET /collections/[accountUuid]/tracks
// get tracks

export async function GET(request: Request, { params }: { params: { accountUuid: string } }) {
  const accountUuid = params.accountUuid;
  
  // check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null || tokenUuid !== accountUuid) {
    return NextResponse.json({ error: "not authorized" }, { status: 400 });
  }

  const conn = await getDB();

  // query db for account
  const accountRes = await conn.query("SELECT * FROM account WHERE uuid = $1::text", [accountUuid]);
  if (accountRes.rowCount < 1) {
    return NextResponse.json({ error: "account not found" }, { status: 400 });
  }

  // fetch the list of tracks
  const trackRes = await conn.query(
    `
    SELECT track.*, 
      JSON_AGG(artist.*) as artist, 
      JSON_AGG(album.*) as album,
      JSON_AGG(genre.*) as genre 
    FROM track
      INNER JOIN track_to_artist ON track.id = track_to_artist.track_id
      INNER JOIN artist ON track_to_artist.artist_id = artist.id
      INNER JOIN track_to_album ON track.id = track_to_album.track_id
      INNER JOIN album ON track_to_album.album_id = album.id
      INNER JOIN track_to_genre ON track.id = track_to_genre.track_id
      INNER JOIN genre ON track_to_genre.genre_id = genre.id
      WHERE account_uuid = $1::text 
      ORDER BY track.name DESC
    `, [accountUuid]);
  
  const tracks = trackRes.rows.map(track => {
    const apiTrack = getAPITrack(track);
    apiTrack.albums = track.albums;
    apiTrack.artists = track.artists;
    apiTrack.genres = track.genres;

    return apiTrack;
  });

  return NextResponse.json({ tracks }, { status: 200 });
}



// POST /collections/[accountUuid]/tracks
// upload a file

export async function POST(request: Request, { params }: { params: { accountUuid: string } }) {
  const accountUuid = params.accountUuid;
  
  // check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null || tokenUuid !== accountUuid) {
    return NextResponse.json({ error: "not authorized" }, { status: 400 });
  }

  // write file to filesystem
  const formData = await request.formData();
  // formData.get("file")!.stream();

  // extract metadata

  // insert into db
}