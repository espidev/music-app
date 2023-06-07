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

importAudioFile(client, "29dffbbe-7739-44bc-b273-7164a7627452", "/home/devin/Music/vindicate us/Auvic - Vindicate Us/Auvic - Vindicate Us - 03 Feelin' Good (feat. G. Pak).mp3", "http://localhost:3001");