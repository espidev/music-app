import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { DBGenre, getAPIGenre } from "@/util/models/genre";
import { getAPIArtist } from "@/util/models/artist";
import { getAPIAlbum } from "@/util/models/album";
import { getAPITrack } from "@/util/models/track";
import { NextResponse } from "next/server";

// GET /api/genre/[genreId]/tracks
// get an genre's track list

export async function GET(request: Request, { params }: { params: { genreId: string } }) {
  const genreId = params.genreId;
  
  // check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const conn = await getDB();

  const genreRes = await conn.query(`SELECT * FROM genre WHERE genre.id = $1 LIMIT 1`, [genreId]);
  if (genreRes.rowCount < 1) {
    return NextResponse.json({ error: "genre not found" }, { status: 404 });
  }

  const dbGenre = genreRes.rows[0] as DBGenre;

  if (tokenUuid !== dbGenre.account_uuid) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const genre: any = getAPIGenre(genreRes.rows[0]);

  const trackRes = await conn.query(`
    SELECT 
      t.*,
      JSON_AGG(genre.*) as genres,
      JSON_AGG(artist.*) as artists, 
      JSON_AGG(album.*) as albums
      FROM track_to_genre
      INNER JOIN track as t ON t.id = track_to_genre.track_id
      LEFT OUTER JOIN genre ON track_to_genre.genre_id = genre.id
      LEFT OUTER JOIN track_to_album ON t.id = track_to_album.track_id
      LEFT OUTER JOIN album ON track_to_album.album_id = album.id
      LEFT OUTER JOIN track_to_artist ON t.id = track_to_artist.track_id
      LEFT OUTER JOIN artist ON track_to_artist.artist_id = artist.id
      WHERE track_to_genre.genre_id = $1
      GROUP BY t.id, track_to_album.album_id
      ORDER BY track_to_album.album_id ASC
  `, [genre.id]);

  await conn.end();

  const tracks = trackRes.rows.map(track => {
    const apiTrack: any = getAPITrack(track);
    apiTrack.albums = track.albums.filter((album: any) => album).map((album: any) => getAPIAlbum(album));
    apiTrack.artists = track.artists.filter((artist: any) => artist).map((artist: any) => getAPIArtist(artist));
    apiTrack.genres = track.genres.filter((genre: any) => genre).map((genre: any) => getAPIGenre(genre));

    return apiTrack;
  });

  return NextResponse.json(tracks, { status: 200 });
}
