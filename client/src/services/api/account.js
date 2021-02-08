import { requestGet, requestPut } from "./request.js";

export async function getUsername(getAccessToken) {
  const response = await requestGet(`/username`, getAccessToken);
  return response.json();
}

export async function putUsername(name, getAccessToken) {
  const response = await requestPut(
    `/username`,
    JSON.stringify(name),
    getAccessToken
  );
  return response.json();
}
