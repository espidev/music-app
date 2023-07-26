import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { getAPIPlaylist } from "@/util/models/playlist";
import { NextResponse } from "next/server";

// GET /collections/[accountUuid]/playlists
// get list of playlists

export async function GET(request: Request, { params }: { params: { accountUuid: string } }) {
  const accountUuid = params.accountUuid;
  
  // Check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null || tokenUuid !== accountUuid) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const conn = await getDB();

  // Query the database for playlists belonging to the accountUuid
  try {
    const playlistRes = await conn.query(
      `
      SELECT * FROM playlist
      WHERE account_uuid = $1::text
      ORDER BY name ASC
      `,
      [accountUuid]
    );

    await conn.end();

    // Convert the database result into the API format
    const playlists = playlistRes.rows.map((playlist) => getAPIPlaylist(playlist));

    return NextResponse.json(playlists, { status: 200 });
  } catch (error) {
    console.error(error);
    await conn.end();
    return NextResponse.json({ error: "An error occurred while fetching playlists." }, { status: 500 });
  }
}

// POST /collections/[accountUuid]/playlists
// create a new playlist

export async function POST(request: Request, { params }: { params: { accountUuid: string } }) {
  const accountUuid = params.accountUuid;

  // Check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null || tokenUuid !== accountUuid) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const conn = await getDB();

  // Get the playlist data from the request body
  const { name, description } = await request.json();

  // Validate
  if (!name || name.trim() === "") {
    return NextResponse.json({ error: "Playlist name must not be empty." }, { status: 400 });
  }

  // Create a new playlist in the database
  try {
    const playlistRes = await conn.query(
      `
      INSERT INTO playlist (name, description, account_uuid)
      VALUES ($1::text, $2::text, $3::text)
      RETURNING *
      `,
      [name, description, accountUuid]
    );

    await conn.end();

    // Convert the database result into the API format
    const playlist = getAPIPlaylist(playlistRes.rows[0]);

    return NextResponse.json(playlist, { status: 201 });
  } catch (error) {
    console.error(error);
    await conn.end();
    return NextResponse.json({ error: "An error occurred while creating the playlist." }, { status: 500 });
  }
}
