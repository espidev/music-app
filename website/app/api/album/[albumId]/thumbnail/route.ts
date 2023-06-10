import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { albumId: string } }) {
  const albumId = params.albumId;

  // check if valid id
  if (isNaN(+albumId)) {
    return NextResponse.json({ error: "invalid album id" }, { status: 400 });
  }

  return await fetch(`http://${process.env.FILESTORE_HOST}:${process.env.FILESTORE_PORT}/album-thumbnail/${albumId}`);
}