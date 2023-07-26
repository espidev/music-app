import { getDB } from "@/util/db";
import { NextResponse } from "next/server";

// GET /api/playlist/[playlistId]/thumbnail
// get a playlist's thumbnail

export async function GET(request: Request, { params }: { params: { playlistId: string } }) {
  const playlistId = params.playlistId;

  // check if valid id
  if (isNaN(+playlistId)) {
    return NextResponse.json({ error: "invalid playlist id" }, { status: 400 });
  }

  const conn = await getDB();

  let tracks: any;
  try {
    tracks = await conn.query(`
      SELECT track.id FROM playlist
        INNER JOIN playlist_tracks ON playlist_tracks.playlist_id = $1
        INNER JOIN track ON playlist_tracks.track_id = track.id
        LIMIT 1`, 
      [playlistId]);

    if (tracks.rowCount < 1) {
      // if there are no songs, just use a default image
      return await fetch(`https://github.com/google/material-design-icons/blob/master/png/av/library_music/materialiconsoutlined/48dp/2x/outline_library_music_black_48dp.png?raw=true`);
    }
  } catch (e) {
    await conn.end();
    return NextResponse.json({ error: "invalid playlist id" }, { status: 400 });
  }

  await conn.end();

  const trackId = tracks.rows[0].id;

  return await fetch(`http://${process.env.FILESTORE_HOST}:${process.env.FILESTORE_PORT}/track-thumbnail/${trackId}`);
}