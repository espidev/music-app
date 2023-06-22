-- Feature 1 (Accounts) --

SELECT * FROM account WHERE username = 'username';

-- Feature 2 (Obtain list of tracks and all relevant information) --

SELECT t.*,
      JSON_AGG(artist.*) as artists,
      JSON_AGG(album.*) as albums,
      JSON_AGG(genre.*) as genres
    FROM track as t
      LEFT OUTER JOIN track_to_artist ON t.id = track_to_artist.track_id
      LEFT OUTER JOIN artist ON track_to_artist.artist_id = artist.id
      LEFT OUTER JOIN track_to_album ON t.id = track_to_album.track_id
      LEFT OUTER JOIN album ON track_to_album.album_id = album.id
      LEFT OUTER JOIN track_to_genre ON t.id = track_to_genre.track_id
      LEFT OUTER JOIN genre ON track_to_genre.genre_id = genre.id
      WHERE t.account_uuid = 'b3837b5a-7b11-47f5-80be-b445febe6f09'
      GROUP BY t.id
      ORDER BY t.name ASC;

-- Feature 3 (Fetch tracks by album, in order) --

SELECT
    t.*,
    track_to_album.position as album_track,
    JSON_AGG(artist.*) as artists,
    JSON_AGG(album.*) as albums,
    JSON_AGG(genre.*) as genres
    FROM track_to_album
    INNER JOIN track as t ON t.id = track_to_album.track_id
    LEFT OUTER JOIN track_to_artist ON t.id = track_to_artist.track_id
    LEFT OUTER JOIN artist ON track_to_artist.artist_id = artist.id
    LEFT OUTER JOIN album ON track_to_album.album_id = album.id
    LEFT OUTER JOIN track_to_genre ON t.id = track_to_genre.track_id
    LEFT OUTER JOIN genre ON track_to_genre.genre_id = genre.id
    WHERE track_to_album.album_id = 20
    GROUP BY t.id, track_to_album.position
    ORDER BY track_to_album.position ASC;

-- Feature 4 (Search tracks) --

SELECT * FROM track
    WHERE name LIKE ('%birb%') OR
        artist_display_name LIKE ('%birb%');
