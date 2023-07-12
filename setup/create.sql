-- TODO add delete cascade
-- TODO order for playlists and albums
-- TODO add indexes

BEGIN;

CREATE TABLE IF NOT EXISTS account (
    uuid TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_argon2 TEXT
);

CREATE TABLE IF NOT EXISTS artist (
    id SERIAL PRIMARY KEY,
    name TEXT,
    account_uuid TEXT,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid),
    UNIQUE (name, account_uuid) 
);

CREATE TABLE IF NOT EXISTS album (
    id SERIAL PRIMARY KEY,
    name TEXT,
    album_artist TEXT,
    account_uuid TEXT,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid),
    UNIQUE (name, account_uuid, album_artist)
);

CREATE TABLE IF NOT EXISTS album_to_artist (
    account_uuid TEXT NOT NULL,
    album_id INT NOT NULL,
    artist_id INT NOT NULL,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid),
    FOREIGN KEY (album_id) REFERENCES album(id),
    FOREIGN KEY (artist_id) REFERENCES artist(id),
    PRIMARY KEY (album_id, artist_id)
);

CREATE TABLE IF NOT EXISTS playlist (
    id SERIAL PRIMARY KEY,
    name TEXT,
    account_uuid TEXT,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid),
    UNIQUE (name, account_uuid)
);

CREATE TABLE IF NOT EXISTS genre (
    id SERIAL PRIMARY KEY,
    name TEXT,
    account_uuid TEXT,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid),
    UNIQUE (name, account_uuid)
);

CREATE TABLE IF NOT EXISTS track (
    id SERIAL PRIMARY KEY,
    name TEXT,
    account_uuid TEXT,
    artist_display_name TEXT,
    uploaded_on TIMESTAMP,
    create_year INT,
    audio_length INT,
    num_of_times_played INT NOT NULL DEFAULT 0,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid)
);

CREATE TABLE IF NOT EXISTS track_to_genre (
    account_uuid TEXT NOT NULL,
    track_id INT NOT NULL,
    genre_id INT NOT NULL,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid),
    FOREIGN KEY (track_id) REFERENCES track(id),
    FOREIGN KEY (genre_id) REFERENCES genre(id),
    PRIMARY KEY (track_id, genre_id)
);

CREATE TABLE IF NOT EXISTS track_to_album (
    account_uuid TEXT NOT NULL,
    track_id INT NOT NULL,
    album_id INT NOT NULL,
    position INT,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid),
    FOREIGN KEY (track_id) REFERENCES track(id),
    FOREIGN KEY (album_id) REFERENCES album(id),
    PRIMARY KEY (track_id, album_id)
);

CREATE TABLE IF NOT EXISTS track_to_artist (
    account_uuid TEXT NOT NULL,
    track_id INT NOT NULL,
    artist_id INT NOT NULL,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid),
    FOREIGN KEY (track_id) REFERENCES track(id),
    FOREIGN KEY (artist_id) REFERENCES artist(id),
    PRIMARY KEY (track_id, artist_id)
);

CREATE TABLE IF NOT EXISTS playlist_tracks (
    account_uuid TEXT NOT NULL,
    playlist_id INT NOT NULL,
    track_id INT NOT NULL,
    position INT NOT NULL,
    added_on TIMESTAMP,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid),
    FOREIGN KEY (playlist_id) REFERENCES playlist(id), 
    FOREIGN KEY (track_id) REFERENCES track(id),
    PRIMARY KEY (playlist_id, track_id)
);

COMMIT;
