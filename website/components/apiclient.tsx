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
    url: `/collection/${accountUuid}/albums`
  });
}

export function apiGetCollectionArtists(accountUuid: string) {
  return axios({
    method: 'get',
    url: `/collection/${accountUuid}/artists`
  });
}

export function apiGetCollectionTracks(accountUuid: string) {
  return axios({
    method: 'get',
    url: `/collection/${accountUuid}/tracks`
  });
}

export function apiPostCollectionTracks(accountUuid: string) {
  // TODO
}