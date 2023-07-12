import axios from 'axios';

export function apiPostLogin(username: string, password: string) {
  return axios({ 
    method: 'post', 
    url: '/api/login', 
    data: {
      username,
      password
  } });
}

export function apiPostRegister(username: string, password: string) {
  return axios({
    method: 'post',
    url: '/api/register',
    data: {
      username,
      password
    }
  });
}

export function apiGetCollectionAlbums(accountUuid: string) {
  return axios({
    method: 'get',
    url: `/api/collection/${accountUuid}/albums`
  });
}

export function apiGetAlbum(albumId: string) {
  return axios({
    method: 'get',
    url: `/api/album/${albumId}`
  });
}

export function apiGetAlbumTracks(albumId: string) {
  return axios({
    method: 'get',
    url: `/api/album/${albumId}/tracks`
  });
}

export function apiGetCollectionAlbumsSearch(accountUuid: string, query: string) {
  return axios({
    method: 'get',
    url: `/api/collection/${accountUuid}/albums/search?q=${query}`
  });
}

export function apiGetCollectionArtists(accountUuid: string) {
  return axios({
    method: 'get',
    url: `/api/collection/${accountUuid}/artists`
  });
}

export function apiGetArtist(artistId: string) {
  return axios({
    method: 'get',
    url: `/api/artist/${artistId}`
  });
}

export function apiGetArtistTracks(artistId: string) {
  return axios({
    method: 'get',
    url: `/api/artist/${artistId}/tracks`
  });
}

export function apiGetArtistAlbums(artistId: string) {
  return axios({
    method: 'get',
    url: `/api/artist/${artistId}/albums`
  });
}

export function apiGetCollectionTracks(accountUuid: string) {
  return axios({
    method: 'get',
    url: `/api/collection/${accountUuid}/tracks`
  });
}

export function apiGetCollectionTracksSearch(accountUuid: string, query: string) {
  return axios({
      method: 'get',
      url: `/api/collection/${accountUuid}/tracks/search?q=${query}`
  });
}

export function apiPostCollectionTracks(accountUuid: string, formData: FormData) {
  return axios({
    method: 'post',
    url: `/api/collection/${accountUuid}/tracks`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}
