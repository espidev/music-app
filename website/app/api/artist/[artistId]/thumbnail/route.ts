import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { artistId: string } }) {
  const artistId = params.artistId;

  // check if valid id
  if (isNaN(+artistId)) {
    return NextResponse.json({ error: "invalid artist id" }, { status: 400 });
  }

  return await fetch(`http://${process.env.FILESTORE_HOST}:${process.env.FILESTORE_PORT}/artist-thumbnail/${artistId}`);
}