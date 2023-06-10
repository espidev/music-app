import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { trackId: string } }) {
  const trackId = params.trackId;

  // check if valid id
  if (isNaN(+trackId)) {
    return NextResponse.json({ error: "invalid track id" }, { status: 400 });
  }

  return await fetch(`http://${process.env.FILESTORE_HOST}:${process.env.FILESTORE_PORT}/track/${trackId}`);
}