import { APIArtist } from "./artist";

export type DBAlbum = {
  id: number
  name: string
  account_uuid: string
};

export type APIAlbum = {
  id: number
  name: string
  thumbnail_src: string
  artists: APIArtist
};

export function getAPIAlbum(album: DBAlbum) {
  return {
    id: album.id,
    name: album.name,
    thumbnail_src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Taka_Shiba.jpg/1200px-Taka_Shiba.jpg",
  } as APIAlbum;
}