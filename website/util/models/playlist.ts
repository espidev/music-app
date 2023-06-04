export type DBPlaylist = {
  id: number
  name: string
  account_uuid: string
};

export type APIPlaylist = {
  id: number
  name: string
};

export function getDBPlaylist(playlist: DBPlaylist) {
  return {
    id: playlist.id,
    name: playlist.name,
  } as APIPlaylist;
}