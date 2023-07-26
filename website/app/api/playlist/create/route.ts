import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { NextResponse } from "next/server";

// POST /playlist/create
// Create a new playlist

export async function POST(request: Request) {
  const { name, description } = await request.json();

  // Check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const conn = await getDB();

  try {
    const playlistRes = await conn.query(
      `INSERT INTO playlist (name, description, account_uuid) VALUES ($1, $2, $3) RETURNING *`,
      [name, description, tokenUuid]
    );

    await conn.end();

    const playlist = playlistRes.rows[0];

    return NextResponse.json(playlist, { status: 201 });
  } catch (error) {
    await conn.end();
    console.error("Error creating playlist:", error);
    return NextResponse.json({ error: "An error occurred while creating the playlist" }, { status: 500 });
  }
}
