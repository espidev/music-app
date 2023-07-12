import { getDB } from "@/util/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { trackId: string } }) {
  const trackId = params.trackId;

  // check if valid id
  if (isNaN(+trackId)) {
    return NextResponse.json({ error: "invalid track id" }, { status: 400 });
  }

  const conn = await getDB();

  try {
    await conn.query(`UPDATE track SET num_of_times_played = num_of_times_played + 1 WHERE id = $1`, [trackId]);
  } catch (e) {
    await conn.end();
    return NextResponse.json({ error: "unable to find track and update its played count" }, { status: 404 });
  }

  await conn.end();

  return await fetch(`http://${process.env.FILESTORE_HOST}:${process.env.FILESTORE_PORT}/track/${trackId}`);
}