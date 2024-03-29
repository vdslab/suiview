import { requestGet, requestPost } from "./request";

export async function getMusicContent(
  userName,
  musicId,
  getAccessTokenSilently
) {
  const response = await requestGet(
    `/${userName}/musics/${musicId}/content`,
    getAccessTokenSilently
  );
  return response.blob();
}

export async function getMusicF0(userName, musicId, getAccessTokenSilently) {
  const response = await requestGet(
    `/${userName}/musics/${musicId}/f0`,
    getAccessTokenSilently
  );
  return response.json();
}

export async function getMusicDecibel(
  userName,
  musicId,
  getAccessTokenSilently
) {
  const response = await requestGet(
    `/${userName}/musics/${musicId}/decibel`,
    getAccessTokenSilently
  );
  return response.json();
}

export async function getMusicSpectrumCentroid(
  username,
  musicId,
  getAccessTokenSilently
) {
  const response = await requestGet(
    `/${username}/musics/${musicId}/centroid`,
    getAccessTokenSilently
  );
  return response.json();
}

export async function getMusicSpectrumRolloff(
  username,
  musicId,
  getAccessTokenSilently
) {
  const response = await requestGet(
    `/${username}/musics/${musicId}/rolloff`,
    getAccessTokenSilently
  );
  return response.json();
}

export async function putMusicComment(
  username,
  musicId,
  comment,
  getAccessTokenSilently
) {
  const response = await requestPost(
    `/${username}/musics/${musicId}/comment`,
    JSON.stringify({ comment: comment }),
    getAccessTokenSilently
  );
  return response.json();
}

export async function getMusicStability(userName, musicId, getAccessToken) {
  const response = await requestGet(
    `/${userName}/musics/${musicId}/stability`,
    getAccessToken
  );
  return response.json();
}
