export type DBArtist = {
  id: number
  name: string
  account_uuid: string
};

export type APIArtist = {
  id: number
  name: string
};

export function getAPIArtist(artist: DBArtist) {
  if (!artist) {
    return null;
  }

  return {
    id: artist.id,
    name: artist.name,
  } as APIArtist;
}