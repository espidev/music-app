export type DBPlaylist = {
  id: number
  name: string
  account_uuid: string
};

export type APIPlaylist = {
  id: number
  name: string
};

export function getAPIPlaylist(playlist: DBPlaylist) {
  if (!playlist) {
    return null;
  }

  return {
    id: playlist.id,
    name: playlist.name,
  } as APIPlaylist;
};