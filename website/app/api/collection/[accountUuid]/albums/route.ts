import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { getAPIAlbum } from "@/util/models/album";
import { getAPIArtist } from "@/util/models/artist";
import { NextResponse } from "next/server";

// GET /collections/[accountUuid]/albums
// get list of albums

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

  // fetch the list of albums
  const albumRes = await conn.query(
    `
    SELECT *, 
      JSON_AGG(artist.*) as artists
    FROM album as a
      LEFT OUTER JOIN album_to_artist ON a.id = album_to_artist.album_id
      LEFT OUTER JOIN artist ON album_to_artist.artist_id = artist.id
      WHERE a.account_uuid = $1::text 
      GROUP BY album_to_artist.account_uuid, a.id, album_to_artist.album_id, album_to_artist.artist_id, artist.id
      ORDER BY a.name DESC
    `, [accountUuid]);
  
  const albums = albumRes.rows.map(album => {
    const apiAlbum = getAPIAlbum(album);
    apiAlbum.artists = album.artists.map((artist: any) => getAPIArtist(artist));

    return apiAlbum;
  });

  return NextResponse.json({ albums }, { status: 200 });
}