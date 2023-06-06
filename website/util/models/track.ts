export type DBTrack = {
  id: number
  name: string
  account_uuid: string
  artist_display_name: string
  uploaded_on: number
  create_year: number
  audio_length: number
};

export type APITrack = {
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

export type APITrackToAlbum = {
  album_id: number
  album_name: number
  position: number
};

export type APITrackToGenre = {
  genre_id: number,
  genre_name: string
};

export type APITrackToArtist = {
  artist_id: number,
  artist_name: string,
};

export function getAPITrack(track: DBTrack) {
  return {
    id: track.id,
    name: track.name,
    artist_name: track.artist_display_name,
    uploaded_on: track.uploaded_on,
    thumbnail_src: "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*", // TODO
    audio_src: "", // TODO
    create_year: track.create_year,
    audio_length: track.audio_length,
  } as APITrack;
}
