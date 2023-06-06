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

importAudioFile(client, "bed889a7-c7e4-4f6d-9921-a8d2713cefbd", "/home/devin/Music/voices call/Auvic - Voices Call- Remastered/Auvic - Voices Call- Remastered - 01 Future Mornings.mp3");