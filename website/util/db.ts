import { Client } from 'pg';
import { readFile } from 'fs/promises';
import path from 'path';

const client = new Client();
    
export async function getDB() {
    const client = new Client();
    await client.connect();

    return client;
}

export async function initDB() {
    const db = await getDB();

    console.log('initializing database...');
    try {
        await db.query(await readFromSQLFile('create.sql'));
        console.log('initialized the database, uwu');
    } catch (err) {
        console.error('failed to initialize the database, uwu');
        console.error(err);
    } finally {
        await db.end();   
    }
}

export function readFromSQLFile(file: string) {
    return readFile(path.join(__dirname, 'util', 'db', file), 'utf8');
}

initDB();