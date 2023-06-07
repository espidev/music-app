import { readFile } from "fs/promises";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { albumId: string } }) {
  const albumId = params.albumId;

  // check if valid id
  if (isNaN(+albumId)) {
    return NextResponse.json({ error: "invalid album id" }, { status: 400 });
  }

  let data: Buffer;
  try {
    data = await readFile(`storage/album-thumbnail/${albumId}`);
  } catch(err) {
    return NextResponse.json({ error: "could not find file" }, { status: 404 });
  }

  return new Response(data, { 
    status: 200,
    headers: {
      
    }
  });
}