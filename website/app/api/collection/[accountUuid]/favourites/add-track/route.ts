import { checkAuthenticated } from "@/util/api";
import { FAVOURITES_PLAYLIST_NAME } from "@/util/constants";
import { getDB } from "@/util/db";
import { NextResponse } from "next/server";

// POST /collection/[accountUuid]/favourites/add-track
// Add a track to the favourites
// Request body:
// { trackId }

export async function POST(request: Request, { params }: { params: { accountUuid: string } }) {
  const { trackId } = await request.json();

  // check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null || tokenUuid !== params.accountUuid) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const conn = await getDB();

  try {

    let playlistId = 0;

    // check if playlist exists
    const playlistRes = await conn.query(`
      SELECT id FROM playlist WHERE name = $1 AND account_uuid = $2
    `, [FAVOURITES_PLAYLIST_NAME, tokenUuid]);

    if (playlistRes.rowCount === 0) {
    
      // add favourites playlist if it doesn't exist
      const insertQuery = await conn.query(`
        INSERT INTO playlist (name, account_uuid) VALUES ($1, $2) RETURNING *
      `, [FAVOURITES_PLAYLIST_NAME, tokenUuid]);

      playlistId = insertQuery.rows[0].id;
    
    } else {
      playlistId = playlistRes.rows[0].id;
    }

    // check if track exists
    const trackRes = await conn.query(`
      SELECT id FROM track WHERE id = $1 AND account_uuid = $2    
    `, [trackId, tokenUuid]);

    if (trackRes.rowCount === 0) {
      await conn.end();
      return NextResponse.json({ error: 'track not found' }, { status: 404 });
    }

    // check how many tracks there are
    const trackCountRes = await conn.query(`
      SELECT COUNT(*) FROM playlist_tracks WHERE playlist_id = $1
    `, [playlistId]);

    const trackCount = trackCountRes.rows[0].count;

    // insert the track association
    await conn.query(`
      INSERT INTO playlist_tracks(account_uuid, playlist_id, track_id, position, added_on)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [tokenUuid, playlistId, trackId, trackCount, new Date().toISOString()]
    );

    await conn.end();

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    await conn.end();
    console.error("Error updating playlist:", error);
    return NextResponse.json({ error: 'an error occurred while updating the playlist' }, { status: 500 });
  }
}