import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { NextResponse } from "next/server";
import { getAPITrack } from "@/util/models/track";
import { getAPIAlbum } from "@/util/models/album";
import { getAPIArtist } from "@/util/models/artist";
// import { getAPIGenre } from "@/util/models/genre";
import {useSearchParams} from "next/navigation";

// GET /api/album/[albumId]/tracks/search
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
  // const search = useSearchParams().get("q");
  const query = request.url.split("?")[1];
  const p = new URLSearchParams(query);
  const search = p.get("q");

  console.log("search: ", search)

  // fetch the list of albums and their tracks
  const albumRes = await conn.query(
    `
    SELECT album.*, 
      JSON_AGG(track.*) as tracks,
    FROM album as a
      LEFT OUTER JOIN track_to_album tta ON a.id = tta.album_id
      LEFT OUTER JOIN track t ON t.id = tta.track_id
      WHERE a.account_uuid = $1::text AND (
        a.name ILIKE $2 OR
        a.album_artist ILIKE $2 OR
        t.name ILIKE $2 OR
      )
      GROUP BY a.id
      ORDER BY a.name ASC
    `, [accountUuid, `%${search}%`]);

  await conn.end();
  
  const albums = albumRes.rows.map((album) => {
    const apiAlbum: any = getAPIAlbum(album);
    // apiAlbum.albums = track.albums.filter((album: any) => album).map((album: any) => getAPIAlbum(album));
    // apiAlbum.artists = track.artists.filter((artist: any) => artist).map((artist: any) => getAPIArtist(artist));
    return apiAlbum;
  });

  return NextResponse.json(albums, { status: 200 });
}
