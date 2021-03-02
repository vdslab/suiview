import { requestGet, requestPost, requestPut } from "./request.js";

export async function getUsers(getAccessToken) {
  const response = await requestGet(`/users`, getAccessToken);
  return response.json();
}

export async function postStudentsList(item, getAccessToken) {
  const response = await requestPost(
    `/student`,
    JSON.stringify(item),
    getAccessToken
  );
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

export async function getUsername(getAccessToken) {
  const response = await requestGet(`/username`, getAccessToken);
  console.log(response);
  return response.json();
}
