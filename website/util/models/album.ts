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
  thumbnail_src: string
  artists: APIArtist
};

export function getAPIAlbum(album: DBAlbum) {
  if (!album) {
    return null;
  }

  return {
    id: album.id,
    name: album.name,
    album_artist: album.album_artist,
    thumbnail_src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Taka_Shiba.jpg/1200px-Taka_Shiba.jpg",
  } as APIAlbum;
}