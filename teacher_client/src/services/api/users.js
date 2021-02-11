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
