import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { NextResponse } from "next/server";

// POST /playlist/remove/[playlistId]
// Remove an existing playlist

export async function POST(request: Request, { params }: { params: { playlistId: string } }) {
  const playlistId = params.playlistId;

  // Check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const conn = await getDB();

  try {
    const deleteRes = await conn.query(
      `DELETE FROM playlist WHERE id = $1 AND account_uuid = $2`,
      [playlistId, tokenUuid]
    );

    await conn.end();

    if (deleteRes.rowCount === 0) {
      return NextResponse.json({ error: "Playlist not found or not authorized to delete" }, { status: 404 });
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    await conn.end();
    console.error("Error removing playlist:", error);
    return NextResponse.json({ error: "An error occurred while removing the playlist" }, { status: 500 });
  }
}
