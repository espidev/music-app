import { getDB } from "@/util/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { artistId: string } }) {
  const artistId = params.artistId;

  // check if valid id
  if (isNaN(+artistId)) {
    return NextResponse.json({ error: "invalid artist id" }, { status: 400 });
  }

  const conn = await getDB();

  let tracks: any;
  try {
    tracks = await conn.query(`
      SELECT track.id FROM artist 
        INNER JOIN track_to_artist ON track_to_artist.artist_id = $1
        INNER JOIN track ON track_to_artist.track_id = track.id
        LIMIT 1`, 
      [artistId]);

    console.log(tracks.rowCount);

    if (tracks.rowCount < 1) {
      return await fetch(`http://${process.env.FILESTORE_HOST}:${process.env.FILESTORE_PORT}/artist-thumbnail/${artistId}`);
    }
  } catch (e) {
    await conn.end();
    return NextResponse.json({ error: "invalid album id" }, { status: 400 });
  }

  await conn.end();

  const trackId = tracks.rows[0].id;

  return await fetch(`http://${process.env.FILESTORE_HOST}:${process.env.FILESTORE_PORT}/track-thumbnail/${trackId}`);
}