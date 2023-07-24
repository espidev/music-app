import { APITrack } from "@/util/models/track";

export type DBPlaylist = {
  id: number
  name: string
  account_uuid: string
};

export type APIPlaylist = {
  id: number
  name: string
};

export interface APIPlaylistTrack {
  id: number;
  name: string;
  artist: string;
  duration: number;
}

export function getDBPlaylist(playlist: DBPlaylist) {
  if (!playlist) {
    return playlist;
  }

  return {
    id: playlist.id,
    name: playlist.name,
  } as APIPlaylist;
}

export function getAPIPlaylistTrack(dbPlaylistTrack: any): APIPlaylistTrack {
  // Convert the database representation (dbPlaylistTrack) to the API representation (APIPlaylistTrack)
  const apiPlaylistTrack: APIPlaylistTrack = {
    id: dbPlaylistTrack.id,
    name: dbPlaylistTrack.name,
    artist: dbPlaylistTrack.artist,
    duration: dbPlaylistTrack.duration,
  };

  return apiPlaylistTrack;
}
