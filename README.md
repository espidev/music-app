# music-app

The website and backend is in the `website` folder. The file storage server is in the `filestore` folder.

#### Testing

Docker is used for consistent deployments:

```bash
$ cd website
$ docker build . -t music-app:latest
$ cd ..
$ docker compose up
```

#### Developing

Set up a local MariaDB server (can use Docker), and then run:

```bash
$ cd website
$ npm install
$ npm run dev
```

#### Loading and interacting with MariaDB in Docker

With the Docker Compose stack up:

```bash
$ docker exec -it cs348_db_1 mariadb --user root -pchange-me

# Should now be in the MariaDB CLI
```

We can run a few commands to do some basic queries in the MariaDB CLI:

```bash
CREATE DATABASE test;
USE test;
CREATE TABLE user(name TEXT);
SELECT * FROM user;
```
