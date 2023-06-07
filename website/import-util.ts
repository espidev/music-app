import pkg from 'pg';
const { Client } = pkg;
import { importAudioFile } from "./util/import";

console.log('starting import');

const client = new Client({
  host: "localhost",
  port: 5432,
  database: "musicapp",
  user: "postgres",
  password: "password",
});
await client.connect();

importAudioFile(client, "4f67ff10-560e-461e-afcf-806ecdae588c", "/home/devin/Music/Devin's Everything/Acro & UgokuBall - Journey.opus", "http://localhost:3001");