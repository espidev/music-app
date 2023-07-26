import { checkAuthenticated } from "@/util/api";
import { FAVOURITES_PLAYLIST_NAME } from "@/util/constants";
import { getDB } from "@/util/db";
import { DBPlaylistTrack } from "@/util/models/playlist";
import { NextResponse } from "next/server";

// POST /collection/[accountUuid]/favourites/remove-track
// Removes a track from the favourites
// Request body:
// { trackId }

export async function POST(request: Request, { params }: { params: { accountUuid: string } }) {
  let { trackId } = await request.json();

  // check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null || tokenUuid !== params.accountUuid) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const conn = await getDB();

  try {
    // check if playlist exists
    const playlistRes = await conn.query(`
      SELECT id FROM playlist WHERE name = $1 AND account_uuid = $2
    `, [FAVOURITES_PLAYLIST_NAME, tokenUuid]);

    if (playlistRes.rowCount === 0) {
      await conn.end();
      return NextResponse.json({ error: "favourites not found or not authorized to update" }, { status: 404 });
    }

    const playlistId = playlistRes.rows[0].id;

    // check how many tracks there are
    const tracksRes = await conn.query(`
      SELECT * FROM playlist_tracks WHERE playlist_id = $1
    `, [playlistId]);

    await conn.query(`BEGIN`);

    // delete favourites entry
    const deleteRes = await conn.query(`
      DELETE FROM playlist_tracks
        WHERE playlist_id = $1 AND track_id = $2 
        RETURNING *
      `, [playlistId, trackId]);
    
    // if the track wasn't found
    if (deleteRes.rowCount === 0) {
      await conn.query(`COMMIT`);
      await conn.end();
      return NextResponse.json({ error: 'track not found in playlist' }, { status: 404 });
    }

    // add the position it was deleted at
    const position = deleteRes.rows[0].position;

    const playlistTracks = tracksRes.rows as DBPlaylistTrack[];

    // update other entries (all position spots after)
    for (const playlistTrack of playlistTracks) {
      if (playlistTrack.position > position) {
        
        await conn.query(`
          UPDATE playlist_tracks SET position = $1 WHERE playlist_id = $2 AND position = $3 AND track_id = $4
        `, [playlistTrack.position - 1, playlistId, playlistTrack.position, playlistTrack.track_id]);

      }
    }

    await conn.query(`COMMIT`);
    await conn.end();

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {

    await conn.query(`ROLLBACK`);

    await conn.end();
    console.error("Error updating playlist:", error);
    return NextResponse.json({ error: 'an error occurred while updating the playlist' }, { status: 500 });
  }
}