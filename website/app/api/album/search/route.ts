import { getDB } from "@/util/db";
import { NextResponse } from "next/server";
import { getAPIAlbum } from "@/util/models/album";

// GET /api/album/search
// Search for albums

export async function GET(request: Request, { params }: { params: {} }) {
  const conn = await getDB();

  // get url parameter
  const query = request.url.split("?")[1];
  const p = new URLSearchParams(query);
  const search = p.get("q");

  const albumRes = await conn.query(
    `
    SELECT a.*
    FROM album as a
      LEFT OUTER JOIN track_to_album tta ON a.id = tta.album_id
      LEFT OUTER JOIN track t ON t.id = tta.track_id
      WHERE (a.name ILIKE $1 OR
        a.album_artist ILIKE $1 OR
        t.name ILIKE $1)
      GROUP BY a.id
      ORDER BY a.name ASC
    `, [`%${search}%`]);

  await conn.end();
  
  const albums = albumRes.rows.map((album) => getAPIAlbum(album));

  return NextResponse.json(albums, { status: 200 });
}
