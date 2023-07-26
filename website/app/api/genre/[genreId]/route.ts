import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { DBGenre, getAPIGenre } from "@/util/models/genre";
import { NextResponse } from "next/server";

// GET /api/genre/[genreId]
// get a genre

export async function GET(request: Request, { params }: { params: { genreId: string } }) {
  const genreId = params.genreId;
  
  // check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const conn = await getDB();

  const genreRes = await conn.query(`SELECT * FROM genre WHERE genre.id = $1 LIMIT 1`, [genreId]);
  if (genreRes.rowCount < 1) {
    return NextResponse.json({ error: "genre not found" }, { status: 404 });
  }

  await conn.end();

  const dbGenre = genreRes.rows[0] as DBGenre;
  if (tokenUuid !== dbGenre.account_uuid) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const genre = getAPIGenre(genreRes.rows[0]);

  return NextResponse.json(genre, { status: 200 });
}