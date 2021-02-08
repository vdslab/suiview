import {
  requestGet,
  requestPost,
  requestPut,
  requestDelete,
} from "./request.js";

export async function getUsers() {
  const response = await fetch(`http://localhost:8080/users`);
  //const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/users`);
  return response.json();
}
