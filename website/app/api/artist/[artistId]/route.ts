import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { DBArtist, getAPIArtist } from "@/util/models/artist";
import { NextResponse } from "next/server";

// GET /api/artist/[artistId]
// get an artist

export async function GET(request: Request, { params }: { params: { artistId: string } }) {
  const artistId = params.artistId;
  
  // check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const conn = await getDB();

  const artistRes = await conn.query(`SELECT * FROM artist WHERE artist.id = $1 LIMIT 1`, [artistId]);
  if (artistRes.rowCount < 1) {
    return NextResponse.json({ error: "artist not found" }, { status: 404 });
  }

  await conn.end();

  const dbArtist = artistRes.rows[0] as DBArtist;
  if (tokenUuid !== dbArtist.account_uuid) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const artist = getAPIArtist(artistRes.rows[0]);

  return NextResponse.json(artist, { status: 200 });
}