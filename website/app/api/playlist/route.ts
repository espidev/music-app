import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { NextResponse } from "next/server";

// GET /playlist/[playlistId]
// Get playlist details

export async function GET(request: Request, { params }: { params: { playlistId: string } }) {
  const playlistId = params.playlistId;

  // Check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const conn = await getDB();

  try {
    const playlistRes = await conn.query(
      `SELECT * FROM playlist WHERE id = $1 AND account_uuid = $2 LIMIT 1`,
      [playlistId, tokenUuid]
    );

    await conn.end();

    if (playlistRes.rowCount === 0) {
      return NextResponse.json({ error: "Playlist not found or not authorized to access" }, { status: 404 });
    }

    const playlist = playlistRes.rows[0];

    return NextResponse.json(playlist, { status: 200 });
  } catch (error) {
    await conn.end();
    console.error("Error fetching playlist:", error);
    return NextResponse.json({ error: "An error occurred while fetching the playlist" }, { status: 500 });
  }
}
