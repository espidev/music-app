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

export function apiGetCollectionAlbum(albumId: string) {
  return axios({
    method: 'get',
    url: `/api/album/${albumId}`
  });
}

export function apiGetCollectionAlbumTracks(albumId: string) {
  return axios({
    method: 'get',
    url: `/api/album/${albumId}/tracks`
  });
}

export function apiGetCollectionArtists(accountUuid: string) {
  return axios({
    method: 'get',
    url: `/api/collection/${accountUuid}/artists`
  });
}

export function apiGetCollectionTracks(accountUuid: string) {
  return axios({
    method: 'get',
    url: `/api/collection/${accountUuid}/tracks`
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