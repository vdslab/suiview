import {
  requestGet,
  requestPost,
  requestPut,
  requestDelete,
} from "./request.js";

export async function getMusics(getAccessToken) {
  const response = await requestGet(`/musics`, getAccessToken);
  return response.json();
}

export async function getMusic(musicId, getAccessToken) {
  const response = await requestGet(`/musics/${musicId}`, getAccessToken);
  return response.json();
}

export async function getMusicComments(musicId, getAccessToken) {
  const response = await requestGet(
    `/musics/${musicId}/comments`,
    getAccessToken,
  );
  return response.json();
}

export async function getMusicContent(musicId, getAccessToken) {
  const response = await requestGet(
    `/musics/${musicId}/content`,
    getAccessToken,
  );
  return response.blob();
}

export async function getMusicDecibel(musicId, getAccessToken) {
  const response = await requestGet(
    `/musics/${musicId}/decibel`,
    getAccessToken,
  );
  return response.json();
}

export async function getMusicF0(musicId, getAccessToken) {
  const response = await requestGet(`/musics/${musicId}/f0`, getAccessToken);
  return response.json();
}

export async function getMusicSpectrumCentroid(musicId, getAccessToken) {
  const response = await requestGet(
    `/musics/${musicId}/spectrum_centroid`,
    getAccessToken,
  );
  return response.json();
}

export async function getMusicSpectrumRolloff(musicId, getAccessToken) {
  const response = await requestGet(
    `/musics/${musicId}/spectrum_rolloff`,
    getAccessToken,
  );
  return response.json();
}

export async function postMusic(item, getAccessToken) {
  const response = await requestPost(
    `/musics`,
    JSON.stringify(item),
    getAccessToken,
  );
  return response.json();
}

export async function putMusic(musicId, item, getAccessToken) {
  const response = await requestPut(
    `/musics/${musicId}`,
    JSON.stringify(item),
    getAccessToken,
  );
  return response.json();
}

export async function putMusicContent(musicId, content, getAccessToken) {
  const response = await requestPut(
    `/musics/${musicId}/content`,
    content,
    getAccessToken,
  );
  return response.json();
}

export async function deleteMusic(musicId, getAccessToken) {
  const response = await requestDelete(`/musics/${musicId}`, getAccessToken);
  return response.json();
}
