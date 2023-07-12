import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { DBArtist, getAPIArtist } from "@/util/models/artist";
import { getAPIAlbum } from "@/util/models/album";
import { NextResponse } from "next/server";

// GET /api/artist/[artistId]/albums
// get an artist's album list

export async function GET(request: Request, { params }: { params: { artistId: string } }) {
  const artistId = params.artistId;
  
  // check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const conn = await getDB();

  const artistRes = await conn.query(`SELECT * FROM artist WHERE artist.id = $1 LIMIT 1`, [artistId]);
  if (artistRes.rowCount < 1) {
    return NextResponse.json({ error: "artist not found" }, { status: 404 });
  }

  const dbArtist = artistRes.rows[0] as DBArtist;

  if (tokenUuid !== dbArtist.account_uuid) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const artist: any = getAPIArtist(artistRes.rows[0]);

  const albumRes = await conn.query(`
    SELECT a.*,
      JSON_AGG(artist.*) as artists
      FROM album_to_artist
      LEFT OUTER JOIN album as a ON album_to_artist.album_id = a.id
      INNER JOIN artist ON album_to_artist.artist_id = artist.id
      WHERE album_to_artist.artist_id = $1
      GROUP BY a.id, album_to_artist.album_id
      ORDER BY a.name DESC
    `, [artist.id]);

  await conn.end();

  const albums = albumRes.rows.map(album => {
    const apiAlbum = getAPIAlbum(album);

    if (apiAlbum) {
      apiAlbum.artists = album.artists.map((artist: any) => getAPIArtist(artist));
    }

    return apiAlbum;
  });

  return NextResponse.json(albums, { status: 200 });
}
