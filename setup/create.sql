-- TODO add delete cascade
-- TODO order for playlists and albums
-- TODO add indexes

CREATE TABLE IF NOT EXISTS account (
    uuid TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_argon2 TEXT
);

CREATE TABLE IF NOT EXISTS artist (
    id SERIAL PRIMARY KEY,
    name TEXT,
    account_uuid TEXT,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid)
);

CREATE TABLE IF NOT EXISTS album (
    id SERIAL PRIMARY KEY,
    name TEXT,
    account_uuid TEXT,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid)
);

CREATE TABLE IF NOT EXISTS album_to_artist (
    account_uuid TEXT,
    album_id INT,
    artist_id INT,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid),
    FOREIGN KEY (album_id) REFERENCES album(id),
    FOREIGN KEY (artist_id) REFERENCES artist(id)
);

CREATE TABLE IF NOT EXISTS playlist (
    id SERIAL PRIMARY KEY,
    name TEXT,
    account_uuid TEXT,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid)
);

CREATE TABLE IF NOT EXISTS genre (
    id SERIAL PRIMARY KEY,
    name TEXT,
    account_uuid TEXT,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid)
);

CREATE TABLE IF NOT EXISTS track (
    id SERIAL PRIMARY KEY,
    name TEXT,
    account_uuid TEXT,
    artist_display_name TEXT,
    uploaded_on TIMESTAMP,
    create_year INT,
    audio_length INT, -- TODO (seconds lOl 1337)?
    FOREIGN KEY (account_uuid) REFERENCES account(uuid)
);

CREATE TABLE IF NOT EXISTS track_to_genre (
    account_uuid TEXT,
    track_id INT,
    genre_id INT,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid),
    FOREIGN KEY (track_id) REFERENCES track(id),
    FOREIGN KEY (genre_id) REFERENCES genre(id) 
);

CREATE TABLE IF NOT EXISTS track_to_album (
    account_uuid TEXT,
    track_id INT,
    album_id INT,
    position INT,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid),
    FOREIGN KEY (track_id) REFERENCES track(id),
    FOREIGN KEY (album_id) REFERENCES album(id) 
);

CREATE TABLE IF NOT EXISTS track_to_artist (
    account_uuid TEXT,
    track_id INT,
    artist_id INT,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid),
    FOREIGN KEY (track_id) REFERENCES track(id),
    FOREIGN KEY (artist_id) REFERENCES artist(id)
);

CREATE TABLE IF NOT EXISTS playlist_tracks (
    account_uuid TEXT,
    playlist_id INT,
    track_id INT,
    position INT NOT NULL,
    added_on TIMESTAMP,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid),
    FOREIGN KEY (playlist_id) REFERENCES playlist(id), 
    FOREIGN KEY (track_id) REFERENCES track(id)
);
