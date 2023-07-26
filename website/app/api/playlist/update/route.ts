import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { NextResponse } from "next/server";

// POST /playlist/update/[playlistId]
// Update an existing playlist

export async function POST(request: Request, { params }: { params: { playlistId: string } }) {
  const playlistId = params.playlistId;
  const { name, description } = await request.json();

  // Check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const conn = await getDB();

  try {
    const updateRes = await conn.query(
      `UPDATE playlist SET name = $1, description = $2 WHERE id = $3 AND account_uuid = $4 RETURNING *`,
      [name, description, playlistId, tokenUuid]
    );

    await conn.end();

    if (updateRes.rowCount === 0) {
      return NextResponse.json({ error: "Playlist not found or not authorized to update" }, { status: 404 });
    }

    const updatedPlaylist = updateRes.rows[0];

    return NextResponse.json(updatedPlaylist, { status: 200 });
  } catch (error) {
    await conn.end();
    console.error("Error updating playlist:", error);
    return NextResponse.json({ error: "An error occurred while updating the playlist" }, { status: 500 });
  }
}
