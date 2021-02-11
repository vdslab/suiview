import {
  requestGet,
  requestPost,
  requestPut,
  requestDelete,
} from "./request.js";

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
