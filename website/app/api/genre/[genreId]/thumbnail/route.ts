import { getDB } from "@/util/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { genreId: string } }) {
  const genreId = params.genreId;

  // check if valid id
  if (isNaN(+genreId)) {
    return NextResponse.json({ error: "invalid genre id" }, { status: 400 });
  }

  const conn = await getDB();

  let tracks: any;
  try {
    tracks = await conn.query(`
      SELECT track.id FROM genre 
        INNER JOIN track_to_genre ON track_to_genre.genre_id = $1
        INNER JOIN track ON track_to_genre.track_id = track.id
        LIMIT 1`, 
      [genreId]);

    console.log(tracks.rowCount);

    if (tracks.rowCount < 1) {
      return await fetch(`http://${process.env.FILESTORE_HOST}:${process.env.FILESTORE_PORT}/genre-thumbnail/${genreId}`);
    }
  } catch (e) {
    await conn.end();
    return NextResponse.json({ error: "invalid genre id" }, { status: 400 });
  }

  await conn.end();

  const trackId = tracks.rows[0].id;

  return await fetch(`http://${process.env.FILESTORE_HOST}:${process.env.FILESTORE_PORT}/track-thumbnail/${trackId}`);
}