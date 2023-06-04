import { getDB } from "@/util/db";
import argon2 from "argon2";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// Route /register
// Request with username and password, get back success or failure

export async function POST(request: Request) {
  const reqjson = await request.json();

  const username = reqjson.username;
  const password = reqjson.password;

  const conn = await getDB();

  // hash password
  let hash: string;
  try {
    hash = await argon2.hash(password);
  } catch (err) {
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }

  // check if user exists
  try {
    const res = await conn.query("SELECT * FROM account WHERE username = $1", [username]);

    if (res.rowCount > 0) {
      return NextResponse.json({ error: "username already exists, be more creative" }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }

  // insert account into db
  try {
    await conn.query("INSERT INTO account (uuid, username, password_argon2) VALUES ($1, $2, $3)", [uuidv4(), username, password]);
  } catch (err) {
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }

  return NextResponse.json({ status: "success" }, { status: 200 });
}
