import { checkAuthenticated } from "@/util/api";
import { getDB } from "@/util/db";
import { NextResponse } from "next/server";
import { getAPITrack } from "@/util/models/track";
import { getAPIAlbum } from "@/util/models/album";
import { getAPIArtist } from "@/util/models/artist";
import { getAPIGenre } from "@/util/models/genre";
import { mkdir, unlink, writeFile } from "fs/promises";
import { importAudioFile } from "@/util/import";

// GET /collections/[accountUuid]/tracks
// get list of tracks

export async function GET(request: Request, { params }: { params: { accountUuid: string } }) {
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
    return NextResponse.json({ error: "account not found" }, { status: 404 });
  }

  // fetch the list of tracks
  const trackRes = await conn.query(
    `
    SELECT t.*, 
      JSON_AGG(artist.*) as artists, 
      JSON_AGG(album.*) as albums,
      JSON_AGG(genre.*) as genres
    FROM track as t
      LEFT OUTER JOIN track_to_artist ON t.id = track_to_artist.track_id
      LEFT OUTER JOIN artist ON track_to_artist.artist_id = artist.id
      LEFT OUTER JOIN track_to_album ON t.id = track_to_album.track_id
      LEFT OUTER JOIN album ON track_to_album.album_id = album.id
      LEFT OUTER JOIN track_to_genre ON t.id = track_to_genre.track_id
      LEFT OUTER JOIN genre ON track_to_genre.genre_id = genre.id
      WHERE t.account_uuid = $1::text 
      GROUP BY t.id
      ORDER BY t.name ASC
    `, [accountUuid]);
  
  const tracks = trackRes.rows.map(track => {
    const apiTrack: any = getAPITrack(track);
    apiTrack.albums = track.albums.filter((album: any) => album).map((album: any) => getAPIAlbum(album));
    apiTrack.artists = track.artists.filter((artist: any) => artist).map((artist: any) => getAPIArtist(artist));
    apiTrack.genres = track.genres.filter((genre: any) => genre).map((genre: any) => getAPIGenre(genre));

    return apiTrack;
  });

  return NextResponse.json(tracks, { status: 200 });
}



// POST /collections/[accountUuid]/tracks
// upload a file

export async function POST(request: Request, { params }: { params: { accountUuid: string } }) {
  const accountUuid = params.accountUuid;
  
  // check authorization
  const tokenUuid = await checkAuthenticated();
  if (tokenUuid === null || tokenUuid !== accountUuid) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  // write file to filesystem
  const formData = await request.formData();
  const file = formData.get("file") as any;

  if (!file) {
    return NextResponse.json({ error: 'invalid file' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();

  // create cache folder if not exists
  await mkdir('cache', { recursive: true });

  const fileName = 'cache/' + file.name;

  // write form
  try {
    await writeFile(fileName, toBuffer(arrayBuffer), { flag: 'wx' });

    const db = await getDB();

    // insert into db
    const filestore = `http://${process.env.FILESTORE_HOST}:${process.env.FILESTORE_PORT}`;
    await importAudioFile(db, accountUuid, fileName, filestore);
  } catch (e) {
    console.error(e);
    await unlink(fileName);
    return NextResponse.json({ error: 'an error occurred' }, { status: 500 });
  }
  
  await unlink(fileName);

  return NextResponse.json({ status: 'success' }, { status: 200 });
}

function toBuffer(arrayBuffer : ArrayBuffer) {
  const buffer = Buffer.alloc(arrayBuffer.byteLength);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}