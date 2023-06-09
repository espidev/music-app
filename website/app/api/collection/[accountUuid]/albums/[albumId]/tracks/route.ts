import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { getAPIAlbum } from "@/util/models/album";
import { getAPIArtist } from "@/util/models/artist";
import { getAPIGenre } from "@/util/models/genre";
import { getAPITrack } from "@/util/models/track";
import { NextResponse } from "next/server";

// GET /collections/[accountUuid]/albums/[albumId]/tracks
// get an album's track list

export async function GET(request: Request, { params }: { params: { albumId: string, accountUuid: string } }) {
  const albumId = params.albumId;
  const accountUuid = params.accountUuid;
  
  // check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null || tokenUuid !== accountUuid) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const conn = await getDB();

  // query db for account
  const accountRes = await conn.query("SELECT * FROM account WHERE uuid = $1::text", [accountUuid]);
  if (accountRes.rowCount < 1) {
    return NextResponse.json({ error: "account not found" }, { status: 400 });
  }

  const albumRes = await conn.query(`SELECT * FROM album WHERE album.id = $1 LIMIT 1`, [albumId]);
  if (albumRes.rowCount < 1) {
    return NextResponse.json({ error: "album not found" }, { status: 404 });
  }

  const album: any = getAPIAlbum(albumRes.rows[0]);

  const trackRes = await conn.query(`
    SELECT 
      t.*,
      track_to_album.position as album_track,
      JSON_AGG(artist.*) as artists, 
      JSON_AGG(album.*) as albums,
      JSON_AGG(genre.*) as genres
      FROM track_to_album
      INNER JOIN track as t ON t.id = track_to_album.track_id
      LEFT OUTER JOIN track_to_artist ON t.id = track_to_artist.track_id
      LEFT OUTER JOIN artist ON track_to_artist.artist_id = artist.id
      LEFT OUTER JOIN album ON track_to_album.album_id = album.id
      LEFT OUTER JOIN track_to_genre ON t.id = track_to_genre.track_id
      LEFT OUTER JOIN genre ON track_to_genre.genre_id = genre.id
      WHERE track_to_album.album_id = $1
      GROUP BY t.id, track_to_album.position
      ORDER BY track_to_album.position ASC
  `, [album.id]);

  const tracks = trackRes.rows.map(track => {
    const apiTrack: any = getAPITrack(track);
    apiTrack.albums = track.albums.filter((album: any) => album).map((album: any) => getAPIAlbum(album));
    apiTrack.artists = track.artists.filter((artist: any) => artist).map((artist: any) => getAPIArtist(artist));
    apiTrack.genres = track.genres.filter((genre: any) => genre).map((genre: any) => getAPIGenre(genre));
    apiTrack.album_track = track.album_track;

    return apiTrack;
  });

  return NextResponse.json(tracks, { status: 200 });
}