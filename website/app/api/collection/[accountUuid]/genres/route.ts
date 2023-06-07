import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { getAPIGenre } from "@/util/models/genre";
import { NextResponse } from "next/server";

// GET /collections/[accountUuid]/genres
// get list of genres

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

  // fetch the list of albums
  const genreRes = await conn.query(
    `
    SELECT * FROM genre
      WHERE account_uuid = $1::text 
      ORDER BY genre.name DESC
    `, [accountUuid]);
  
  const genres = genreRes.rows.map(genre => getAPIGenre(genre));

  return NextResponse.json({ genres }, { status: 200 });
}