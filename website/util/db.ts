import { Client } from 'pg';

export async function getDB() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT as any,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });
    await client.connect();

    return client;
}
