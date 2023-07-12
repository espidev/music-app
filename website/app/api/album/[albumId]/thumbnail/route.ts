import { getDB } from "@/util/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { albumId: string } }) {
  const albumId = params.albumId;

  // check if valid id
  if (isNaN(+albumId)) {
    return NextResponse.json({ error: "invalid album id" }, { status: 400 });
  }

  const conn = await getDB();

  let tracks: any;
  try {
    tracks = await conn.query(`
      SELECT track.id FROM album 
        INNER JOIN track_to_album ON track_to_album.album_id = $1
        INNER JOIN track ON track_to_album.track_id = track.id
        LIMIT 1`, 
      [albumId]);

    console.log(tracks.rowCount);

    if (tracks.rowCount < 1) {
      return await fetch(`http://${process.env.FILESTORE_HOST}:${process.env.FILESTORE_PORT}/album-thumbnail/${albumId}`);
    }
  } catch (e) {
    await conn.end();
    return NextResponse.json({ error: "invalid album id" }, { status: 400 });
  }

  await conn.end();

  const trackId = tracks.rows[0].id;

  return await fetch(`http://${process.env.FILESTORE_HOST}:${process.env.FILESTORE_PORT}/track-thumbnail/${trackId}`);
}