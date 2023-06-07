import { getDB } from "@/util/db";
import { DBAccount } from "@/util/models/account";
import argon2 from "argon2";
import jwt from 'jsonwebtoken';
import { cookies } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";

// Route /login
// Request with username and password, get back JWT auth token or error

export async function POST(request: Request) {

  const reqjson = await request.json();
  
  const username = reqjson.username;
  const password = reqjson.password;

  const conn = await getDB();

  // query db for account
  const res = await conn.query("SELECT * FROM account WHERE username = $1::text", [username]);
  if (res.rowCount < 1) {
    return NextResponse.json({ error: "account not found" }, { status: 404 });
  }

  const account = res.rows[0] as DBAccount;

  // check password hashes
  if (!(await argon2.verify(account.password_argon2, password))) {
    return NextResponse.json({ error: "password does not match" }, { status: 400 });
  }

  const token = jwt.sign({ 
    data: { uuid: account.uuid, username: account.username }, 
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // expires in a week 
  }, process.env.JWT_KEY!);

  const cookieStore = cookies();
  cookieStore.set('token', token);

  return NextResponse.json({ token }, { status: 200 });
}
