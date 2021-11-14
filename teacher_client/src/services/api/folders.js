import { requestGet } from "./request.js";

export async function getFolders(username, getAccessTokenSilently) {
  const response = await requestGet(
    `/${username}/folders`,
    getAccessTokenSilently
  );
  return response.json();
}

export async function getFolderMusics(
  username,
  folderId,
  getAccessTokenSilently
) {
  const response = await requestGet(
    `/${username}/folders/${folderId}`,
    getAccessTokenSilently
  );
  return response.json();
}

export async function getFolderProgress(
  username,
  folderId,
  getAccessTokenSilently
) {
  const response = await requestGet(
    `/${username}/folders/${folderId}/progress`,
    getAccessTokenSilently
  );
  return response.json();
}

export async function getFolderDecibel(
  username,
  folderId,
  getAccessTokenSilently
) {
  const response = await requestGet(
    `/${username}/folders/${folderId}/decibel`,
    getAccessTokenSilently
  );
  return response.json();
}

export async function getFolderF0(username, folderId, getAccessTokenSilently) {
  const response = await requestGet(
    `/${username}/folders/${folderId}/f0`,
    getAccessTokenSilently
  );
  return response.json();
}

export async function getFolderParallel(
  username,
  folderId,
  getAccessTokenSilently
) {
  const response = await requestGet(
    `/${username}/folders/${folderId}/parallel`,
    getAccessTokenSilently
  );
  return response.json();
}

export async function getFolderTone(
  username,
  folderId,
  getAccessTokenSilently
) {
  const response = await requestGet(
    `/${username}/folders/${folderId}/tone`,
    getAccessTokenSilently
  );
  return response.json();
}
