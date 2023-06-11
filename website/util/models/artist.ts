export type DBArtist = {
  id: number
  name: string
  account_uuid: string
};

export type APIArtist = {
  id: number
  name: string
  thumbnail_src: string
};

export function getAPIArtist(artist: DBArtist) {
  if (!artist) {
    return null;
  }

  return {
    id: artist.id,
    name: artist.name,
    thumbnail_src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Taka_Shiba.jpg/1200px-Taka_Shiba.jpg",
  } as APIArtist;
}