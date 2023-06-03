-- TODO add delete cascade
-- TODO order for playlists and albums

CREATE TABLE account (
    uuid VARCHAR(128) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    password_bcrypt VARCHAR(255),
);

CREATE TABLE artist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT,
    account_uuid VARCHAR(128),
    has_thumbnail BOOLEAN,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid)
);

CREATE TABLE album (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT,
    account_uuid VARCHAR(128),
    has_thumbnail BOOLEAN,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid)
);

CREATE TABLE album_to_artist (
    account_uuid VARCHAR(128),
    album_id INT,
    artist_id INT,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid),
    FOREIGN KEY (album_id) REFERENCES album(id),
    FOREIGN KEY (artist_id) REFERENCES artist(id)
);

CREATE TABLE playlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_uuid VARCHAR(128),
    FOREIGN KEY (account_uuid) REFERENCES account(uuid)
);

CREATE TABLE genre (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_uuid VARCHAR(128),
    FOREIGN KEY (account_uuid) REFERENCES account(uuid)
);

CREATE TABLE track (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT,
    account_uuid VARCHAR(128),
    artist_display_name TEXT,
    uploaded_on DATETIME,
    has_thumbnail BOOLEAN,
    create_year INT,
    audio_length INT, -- TODO?

    FOREIGN KEY (account_uuid) REFERENCES account(uuid),
);

CREATE TABLE track_to_genre (
    account_uuid VARCHAR(128),
    track_id INT,
    genre_id INT,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid),
    FOREIGN KEY (track_id) REFERENCES track(id),
    FOREIGN KEY (genre_id) REFERENCES genre(id) 
);

CREATE TABLE track_to_album (
    account_uuid VARCHAR(128),
    track_id INT,
    album_id INT,
    order INT,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid),
    FOREIGN KEY (track_id) REFERENCES track(id),
    FOREIGN KEY (album_id) REFERENCES album(id) 
);

CREATE TABLE track_to_artist (
    account_uuid VARCHAR(128),
    track_id INT,
    artist_id INT,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid),
    FOREIGN KEY (track_id) REFERENCES track(id),
    FOREIGN KEY (artist_id) REFERENCES artist(id)
);

CREATE TABLE playlist_tracks (
    account_uuid VARCHAR(128),
    playlist_id INT,
    track_id INT,
    order INT UNSIGNED NOT NULL,
    added_on DATETIME,
    FOREIGN KEY (account_uuid) REFERENCES account(uuid),
    FOREIGN KEY (playlist_id) REFERENCES playlist(id), 
    FOREIGN KEY (track_id) REFERENCES track(id)
);
