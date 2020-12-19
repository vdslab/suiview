import {
  requestGet,
  requestPost,
  requestPut,
  requestDelete,
} from "./request.js";

export async function getFolders(getAccessToken) {
  const response = await requestGet(`/folders`, getAccessToken);
  return response.json();
}

export async function getFolder(folderId, getAccessToken) {
  const response = await requestGet(`/folders/${folderId}`, getAccessToken);
  return response.json();
}

export async function getFolderDecibel(folderId, getAccessToken) {
  const response = await requestGet(
    `/folders/${folderId}/decibel`,
    getAccessToken,
  );
  return response.json();
}

export async function getFolderF0(folderId, getAccessToken) {
  const response = await requestGet(`/folders/${folderId}/f0`, getAccessToken);
  return response.json();
}

export async function getFolderMusics(folderId, getAccessToken) {
  const response = await requestGet(
    `/folders/${folderId}/musics`,
    getAccessToken,
  );
  return response.json();
}

export async function getFolderParallel(folderId, getAccessToken) {
  const response = await requestGet(
    `/folders/${folderId}/parallel`,
    getAccessToken,
  );
  return response.json();
}

export async function getFolderProgress(folderId, getAccessToken) {
  const response = await requestGet(
    `/folders/${folderId}/progress`,
    getAccessToken,
  );
  return response.json();
}

export async function getFolderTone(folderId, getAccessToken) {
  const response = await requestGet(
    `/folders/${folderId}/tone`,
    getAccessToken,
  );
  return response.json();
}

export async function postFolder(item, getAccessToken) {
  const response = await requestPost(
    `/folders`,
    JSON.stringify(item),
    getAccessToken,
  );
  return response.json();
}

export async function putFolder(folderId, item, getAccessToken) {
  const response = await requestPut(
    `/folders/${folderId}`,
    JSON.stringify(item),
    getAccessToken,
  );
  return response.json();
}

export async function deleteFolder(folderId, getAccessToken) {
  const response = await requestDelete(`/folders/${folderId}`, getAccessToken);
  return response.json();
}
