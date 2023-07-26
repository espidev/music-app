# music-app

This is a web application to manage and play music collections.

It supports the following features:

- Multi-user account creation/authentication
  - https://github.com/Raymo111/cs348/blob/main/website/app/login/page.tsx
  - https://github.com/Raymo111/cs348/blob/main/website/app/register/page.tsx
- Fetch songs with info
  - https://github.com/Raymo111/cs348/blob/main/website/app/api/collection/%5BaccountUuid%5D/tracks/route.ts
  - https://github.com/Raymo111/cs348/blob/main/website/app/collection/page.tsx
- Album views, with sorting
  - https://github.com/Raymo111/cs348/blob/main/website/app/collection/albums
  - https://github.com/Raymo111/cs348/tree/main/website/app/api/album/%5BalbumId%5D
  - https://github.com/Raymo111/cs348/blob/main/website/app/api/collection/%5BaccountUuid%5D/albums/route.ts
- Searching for tracks by name, artist, creation year, genre, etc.
  - https://github.com/Raymo111/cs348/blob/main/website/app/api/collection/%5BaccountUuid%5D/tracks/search/route.ts
- Playlists
  - https://github.com/Raymo111/cs348/blob/main/website/app/collection/playlists
- Hot charts
  - https://github.com/Raymo111/cs348/blob/main/website/app/collection/hotcharts
- Music player applet in the webpage footer
  - https://github.com/Raymo111/cs348/blob/main/website/components/mediaplayer.tsx
  - https://github.com/Raymo111/cs348/blob/main/website/components/appstateprovider.tsx
- Web uploader to add music
  - https://github.com/Raymo111/cs348/blob/main/website/app/collection/upload/page.tsx
  - https://github.com/Raymo111/cs348/blob/main/website/app/api/collection/%5BaccountUuid%5D/tracks/route.ts
  - https://github.com/Raymo111/cs348/blob/main/website/util/import.ts
- Asset storage service
  - https://github.com/Raymo111/cs348/tree/main/filestore
- Song queueing
  - https://github.com/Raymo111/cs348/blob/main/website/components/appstateprovider.tsx
- Song favouriting
  - https://github.com/Raymo111/cs348/blob/main/website/app/collection/favourites

---

The production data is at: https://drive.google.com/file/d/1bCoon3Nj-6nh-_RE9vNY4kQnDKoq9Fye/view?usp=sharing

The testing data is at: https://drive.google.com/file/d/11nd32AImDeLA856__QpqkyL5lRC_An66/view?usp=drive_link

In order to load the data into the web application, please use the **`Upload` tab** and batch-upload all the song files to be imported into the database.

---

The website and backend is in the `website` folder. The file storage server is in the `filestore` folder.

### Developing

Set up the local PostgreSQL server:

```bash
$ docker-compose -f db-docker-compose.yml up -d
```

Initialize the database (only needs to be run once):

```bash
$ cd setup
$ npm install
$ npm start
$ cd ..
```

Start the filestore server:

```bash
$ cd filestore
$ npm install
$ npm start
```

In another terminal session, start the webserver:

```bash
$ cd website
$ npm install
$ npm run dev
```

### Testing

Docker is used for consistent deployments:

```bash
$ cd filestore
$ docker build . -t cs348-filestore:latest
$ cd ../setup
$ docker build . -t cs348-setup:latest
$ cd ../website
$ docker build . -t cs348-music-app:latest
$ cd ..
$ docker-compose up
```

### Loading and interacting with PostgreSQL in Docker

With the Docker Compose stack up:

```bash
$ docker exec -it cs348_db_1 psql postgresql://postgres:password@localhost/musicapp

# Should now be in the Postgres CLI
```

We can run a few commands to do some basic queries in the Postgres CLI:

```bash
CREATE DATABASE test;
USE test;
CREATE TABLE user(name TEXT);
SELECT * FROM user;
```
