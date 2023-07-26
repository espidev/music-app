import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { DBPlaylistTrack } from "@/util/models/playlist";
import { NextResponse } from "next/server";

// POST /playlist/[playlistId]/remove-track
// Add a track to the playlist
// Request body:
// { position } or { trackId }

export async function POST(request: Request, { params }: { params: { playlistId: string } }) {
  const playlistId = params.playlistId;
  let { position, trackId } = await request.json();

  if (position === undefined && trackId === undefined) {
    return NextResponse.json({ error: 'invalid query' }, { status: 400 });
  }

  // check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const conn = await getDB();

  try {
    // check if playlist exists
    const playlistRes = await conn.query(`
      SELECT id FROM playlist WHERE id = $1 AND account_uuid = $2
    `, [playlistId, tokenUuid]);

    if (playlistRes.rowCount === 0) {
      await conn.end();
      return NextResponse.json({ error: "playlist not found or not authorized to update" }, { status: 404 });
    }

    // check how many tracks there are
    const tracksRes = await conn.query(`
      SELECT * FROM playlist_tracks WHERE playlist_id = $1
    `, [playlistId]);

    const trackCount = tracksRes.rowCount;

    // check that the requested deletion position is in bounds
    if (position !== undefined && (position >= trackCount || position < 0)) {
      await conn.end();
      return NextResponse.json({ error: 'position out of bounds' }, { status: 400 })
    }

    await conn.query(`BEGIN`);

    // delete entry
    if (trackId !== undefined) {
      
      // HACK: we assume that there is only one occurrence of the track in the playlist, which is true for now...

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
      position = deleteRes.rows[0].position;

    } else {
      await conn.query(`
        DELETE FROM playlist_tracks WHERE playlist_id = $1 AND position = $2
        `, [playlistId, position]);
    }

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