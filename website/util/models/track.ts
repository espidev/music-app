type DBTrack = {
  id: number
  name: string
  account_uuid: string
  artist_display_name: string
  uploaded_on: number
  create_year: number
  audio_length: number
};

type APITrack = {
  id: number
  name: string
  artist_name: string
  uploaded_on: number
  thumbnail_src: string
  audio_src: string
  audio_length: number
  create_year: number

  // manually fill from query
  albums: APITrackToAlbum[]
  artists: APITrackToArtist[]
  genres: APITrackToGenre[]
};

type APITrackToAlbum = {
  album_id: number
  album_name: number
  position: number
};

type APITrackToGenre = {
  genre_id: number,
  genre_name: string
};

type APITrackToArtist = {
  artist_id: number,
  artist_name: string,
};

function getAPITrack(track: DBTrack) {
  return {
    id: track.id,
    name: track.name,
    artist_name: track.artist_display_name,
    uploaded_on: track.uploaded_on,
    thumbnail_src: "https://sineware.ca/paimonmad.297b2dd3.gif", // TODO
    audio_src: "", // TODO
    create_year: track.create_year,
    audio_length: track.audio_length,
  } as APITrack;
}
