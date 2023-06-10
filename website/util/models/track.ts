import { DBAlbum } from "./album";
import { DBArtist } from "./artist";
import { DBGenre } from "./genre";

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

  // optional to be filled
  albums: DBAlbum[]
  artists: DBArtist[]
  genres: DBGenre[]
};

export function getAPITrack(track: DBTrack) {
  return {
    id: track.id,
    name: track.name,
    artist_name: track.artist_display_name,
    uploaded_on: track.uploaded_on,
    thumbnail_src: `/api/track/${track.id}/thumbnail`,
    audio_src: `/api/track/${track.id}/stream`,
    create_year: track.create_year,
    audio_length: track.audio_length,
  } as APITrack;
}
