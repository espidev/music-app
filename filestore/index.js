import express from 'express';
import multer from 'multer';
import { unlink, rename } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { fileTypeFromFile } from 'file-type';
import mv from 'mv';

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

addFileGetRoute('/album-thumbnail/:albumId', 'albumId', 'files/album-thumbnails');
addFilePostRoute('/album-thumbnail/:albumId', 'albumId', 'files/album-thumbnails');

app.delete('/album-thumbnail/:albumId', async (req, res) => {
  const albumId = req.params.albumId;
  await unlink(`files/album-thumbnails/${albumId}`);
  res.sendStatus(200);
});

addFileGetRoute('/artist-thumbnail/:artistId', 'artistId', 'files/artist-thumbnails');
addFilePostRoute('/artist-thumbnail/:artistId', 'artistId', 'files/artist-thumbnails');

app.delete('/artist-thumbnail/:artistId', async (req, res) => {
  const artistId = req.params.artistId;
  await unlink(`files/artist-thumbnails/${artistId}`);
  res.sendStatus(200);
});

addFileGetRoute('/track-thumbnail/:trackId', 'trackId', 'files/track-thumbnails');
addFilePostRoute('/track-thumbnail/:trackId', 'trackId', 'files/track-thumbnails');

app.delete('/track-thumbnail/:trackId', async (req, res) => {
  const trackId = req.params.trackId;
  await unlink(`files/track-thumbnails/${trackId}`);
  res.sendStatus(200);
});

addFileGetRoute('/track/:trackId', 'trackId', 'files/tracks');
addFilePostRoute('/track/:trackId', 'trackId', 'files/tracks');

app.delete('/track/:trackId', async (req, res) => {
  const trackId = req.params.trackId;
  await unlink(`files/tracks/${trackId}`);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`filestore is listening on port ${port}`);
})

function addFileGetRoute(routeName, paramName, folderPath) {
  app.get(routeName, async (req, res) => {
    
    try {
      const paramValue = req.params[paramName];
      const filePath = `${__dirname}/${folderPath}/${paramValue}`;
      res.set('Content-Type', (await fileTypeFromFile(filePath)).mime)
      res.sendFile(filePath);
    } catch (e) {
      console.error(e);
      res.sendStatus(404);
    }

  });
}

function addFilePostRoute(routeName, paramName, folderPath) {
  app.post(routeName, upload.single('file'), async (req, res) => {
    const paramValue = req.params[paramName];
    const file = req.file;

    if (file === undefined || file === null) {
      res.sendStatus(400);
      return;
    }

    mv(file.path, `${folderPath}/${paramValue}`, (err => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    }))
  });
}