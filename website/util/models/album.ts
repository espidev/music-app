import { APIArtist } from "./artist";

export type DBAlbum = {
  id: number
  name: string
  album_artist: string
  account_uuid: string
};

export type APIAlbum = {
  id: number
  name: string
  album_artist: string
  artists: APIArtist
};

export function getAPIAlbum(album: DBAlbum) {
  if (!album) {
    return null;
  }

  return {
    id: album.id,
    name: album.name,
    album_artist: album.album_artist
  } as APIAlbum;
}
