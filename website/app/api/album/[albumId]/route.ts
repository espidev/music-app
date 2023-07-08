import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { DBAlbum, getAPIAlbum } from "@/util/models/album";
import { NextResponse } from "next/server";

// GET /collections/[accountUuid]/albums/[albumId]
// get an album

export async function GET(request: Request, { params }: { params: { albumId: string } }) {
  const albumId = params.albumId;
  
  // check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const conn = await getDB();

  const albumRes = await conn.query(`SELECT * FROM album WHERE album.id = $1 LIMIT 1`, [albumId]);
  if (albumRes.rowCount < 1) {
    return NextResponse.json({ error: "album not found" }, { status: 404 });
  }

  await conn.end();

  const dbAlbum = albumRes.rows[0] as DBAlbum;
  if (tokenUuid !== dbAlbum.account_uuid) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const album = getAPIAlbum(albumRes.rows[0]);

  return NextResponse.json(album, { status: 200 });
}
