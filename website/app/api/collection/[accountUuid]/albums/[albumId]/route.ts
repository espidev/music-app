import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { getAPIAlbum } from "@/util/models/album";
import { NextResponse } from "next/server";

// GET /collections/[accountUuid]/albums/[albumId]
// get an album

export async function GET(request: Request, { params }: { params: { albumId: string, accountUuid: string } }) {
  const albumId = params.albumId;
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
    return NextResponse.json({ error: "account not found" }, { status: 400 });
  }

  const albumRes = await conn.query(`SELECT * FROM album WHERE album.id = $1 LIMIT 1`, [albumId]);
  if (albumRes.rowCount < 1) {
    return NextResponse.json({ error: "album not found" }, { status: 404 });
  }

  const album = getAPIAlbum(albumRes.rows[0]);

  return NextResponse.json(album, { status: 200 });
}