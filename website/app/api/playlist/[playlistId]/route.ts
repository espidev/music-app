import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { NextResponse } from "next/server";

// GET /playlist/[playlistId]
// Get playlist details

export async function GET(request: Request, { params }: { params: { accountUuid: string } }) {
  const playlistId = params.accountUuid;

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

// DELETE /playlist/[playlistId]
// Remove an existing playlist

export async function DELETE(request: Request, { params }: { params: { playlistId: string } }) {
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

// PATCH /playlist/[playlistId]
// Update an existing playlist

export async function PATCH(request: Request, { params }: { params: { playlistId: string } }) {
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
