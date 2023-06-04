export type DBGenre = {
  id: number
  account_uuid: string
  name: string
};

export type APIGenre = {
  id: number
  name: string
};

export function getAPIGenre(genre: DBGenre) {
  return {
    id: genre.id,
    name: genre.name,
  } as APIGenre;
}