import pg from 'pg';
import { readFile } from 'fs/promises';
import 'dotenv/config';

const { Client } = pg;

export async function getDB() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  await client.connect();

  return client;
}

export async function initDB() {
  const db = await getDB();

  console.log('initializing database...');
  try {
    
    const creationQuery = await readFromSQLFile('create.sql');
    await db.query(creationQuery);
    console.log(`initialized the database, uwu`);

  } catch (err) {
    console.error('failed to initialize the database, uwu');
    console.error(err);
  } finally {
    await db.end();   
  }
}

export function readFromSQLFile(file) {
  return readFile(file, 'utf8');
}

initDB();