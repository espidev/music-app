
// GET /collections/[accountUuid]/artists
// get list of albums

import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { getAPIArtist } from "@/util/models/artist";
import { NextResponse } from "next/server";

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
  const artistRes = await conn.query(
    `
    SELECT * FROM artist
      WHERE account_uuid = $1::text 
      ORDER BY artist.name DESC
    `, [accountUuid]);
  
  const artists = artistRes.rows.map(album => getAPIArtist(album));

  return NextResponse.json({ artists }, { status: 200 });
}