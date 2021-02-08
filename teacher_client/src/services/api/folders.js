export async function getFolders(username) {
  const response = await fetch(`http://localhost:8080/folders/${username}`);
  //const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/users`);
  return response.json();
}
