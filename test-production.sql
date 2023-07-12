-- Feature 1 (Accounts) --

SELECT * FROM account WHERE username = 'milestone2';



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
      WHERE t.account_uuid = '8272eaae-593b-47e7-b095-19fd943b006d'
      GROUP BY t.id
      ORDER BY t.name ASC LIMIT 10;



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
     WHERE t.account_uuid = '8272eaae-593b-47e7-b095-19fd943b006d' AND (
       t.name ILIKE '%a%' OR
       t.artist_display_name ILIKE '%a%' OR
       t.create_year::text ILIKE '%a%' OR
       album.name ILIKE '%a%' OR
       genre.name ILIKE '%a%'
     )
     GROUP BY t.id
     ORDER BY t.name ASC LIMIT 10;



-- Feature 5 (Playlists) --
-- This is a playlist that we created. --

SELECT t.*,
  JSON_AGG(artist.*) as artists,
  JSON_AGG(album.*) as albums,
  JSON_AGG(genre.*) as genres
  FROM playlist_tracks as tp
  INNER JOIN track t ON t.id = tp.track_id
  LEFT OUTER JOIN track_to_artist ON t.id = track_to_artist.track_id
  LEFT OUTER JOIN artist ON track_to_artist.artist_id = artist.id
  LEFT OUTER JOIN track_to_album ON t.id = track_to_album.track_id
  LEFT OUTER JOIN album ON track_to_album.album_id = album.id
  LEFT OUTER JOIN track_to_genre ON t.id = track_to_genre.track_id
  LEFT OUTER JOIN genre ON track_to_genre.genre_id = genre.id
  WHERE tp.playlist_id = 2
  GROUP BY t.id, tp.position
  ORDER BY tp.position ASC;



-- Feature 6 (Top Charts) --

SELECT artist.*,
  SUM(track.num_of_times_played) AS total_plays
  FROM track
  INNER JOIN track_to_artist ON track.id = track_to_artist.track_id
  INNER JOIN artist ON track_to_artist.artist_id = artist.id
  WHERE track.account_uuid = '8272eaae-593b-47e7-b095-19fd943b006d'
  GROUP BY artist.id
  ORDER BY total_plays DESC LIMIT 10;
