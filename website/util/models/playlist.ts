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
  if (!playlist) {
    return playlist;
  }

  return {
    id: playlist.id,
    name: playlist.name,
  } as APIPlaylist;
}