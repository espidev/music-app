import express from 'express';
import multer from 'multer';
import { unlink, rename } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { fileTypeFromFile } from 'file-type';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const upload = multer({ dest: 'uploads/' });
const app = express();
const port = 3001;

// create folders if they don't exist
if (!existsSync('files/tracks')) {
  mkdirSync('files/tracks', { recursive: true });
}
if (!existsSync('files/album-thumbnails')) {
  mkdirSync('files/album-thumbnails', { recursive: true });
}
if (!existsSync('files/artist-thumbnails')) {
  mkdirSync('files/artist-thumbnails', { recursive: true });
}
if (!existsSync('files/track-thumbnails')) {
  mkdirSync('files/track-thumbnails', { recursive: true });
}

// setup routes
app.get('/', (req, res) => {
  res.send('filestore is online');
})

app.get('/album-thumbnail/:albumId', async (req, res) => {
  const albumId = req.params.albumId;
  const filePath = `${__dirname}/files/album-thumbnails/${albumId}`;
  res.set('Content-Type', (await fileTypeFromFile(filePath)).mime)
  res.sendFile(filePath);
});

app.post('/album-thumbnail/:albumId', async (req, res) => {
  const albumId = req.params.albumId;
  const file = req.file;

  if (file === undefined || file === null) {
    res.sendStatus(400);
    return;
  }

  await rename(file.path, `files/album-thumbnails/${albumId}`);
  res.sendStatus(200);
})

app.delete('/album-thumbnail/:albumId', async (req, res) => {
  const albumId = req.params.albumId;
  await unlink(`files/album-thumbnails/${albumId}`);
  res.sendStatus(200);
});

app.get('/artist-thumbnail/:artistId', async (req, res) => {
  const artistId = req.params.artistId;
  const filePath = `${__dirname}/files/artist-thumbnails/${artistId}`;
  res.set('Content-Type', (await fileTypeFromFile(filePath)).mime)
  res.sendFile(filePath);
});

app.post('/artist-thumbnail/:artistId', async (req, res) => {
  const artistId = req.params.artistId;
  const file = req.file;

  if (file === undefined || file === null) {
    res.sendStatus(400);
    return;
  }

  await rename(file.path, `files/artist-thumbnails/${artistId}`);
  res.sendStatus(200);
})

app.delete('/artist-thumbnail/:artistId', async (req, res) => {
  const artistId = req.params.artistId;
  await unlink(`files/artist-thumbnails/${artistId}`);
  res.sendStatus(200);
});

app.get('/track-thumbnail/:trackId', async (req, res) => {
  const trackId = req.params.trackId;
  const filePath = `${__dirname}/files/track-thumbnails/${trackId}`;
  res.set('Content-Type', (await fileTypeFromFile(filePath)).mime)
  res.sendFile(filePath);
});

app.post('/track-thumbnail/:trackId', upload.single("file"), async (req, res) => {
  const trackId = req.params.trackId;
  const file = req.file;
  
  if (file === undefined || file === null) {
    res.sendStatus(400);
    return;
  }

  await rename(file.path, `files/track-thumbnails/${trackId}`);
  res.sendStatus(200);
});

app.delete('/track-thumbnail/:trackId', async (req, res) => {
  const trackId = req.params.trackId;
  await unlink(`files/track-thumbnails/${trackId}`);
  res.sendStatus(200);
});

app.get('/track/:trackId', async (req, res) => {
  const trackId = req.params.trackId;
  const filePath = `${__dirname}/files/tracks/${trackId}`;
  res.set('Content-Type', (await fileTypeFromFile(filePath)).mime)
  res.sendFile(filePath);
});

app.post('/track/:trackId', upload.single("file"), async (req, res) => {
  const trackId = req.params.trackId;
  const file = req.file;

  if (file === undefined || file === null) {
    res.sendStatus(400);
    return;
  }

  await rename(file.path, `files/tracks/${trackId}`);
  res.sendStatus(200);
})

app.delete('/track/:trackId', async (req, res) => {
  const trackId = req.params.trackId;
  await unlink(`files/tracks/${trackId}`);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`filestore is listening on port ${port}`);
})