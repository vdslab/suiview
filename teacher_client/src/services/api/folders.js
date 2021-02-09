export async function getFolders(username) {
  const response = await fetch(`http://localhost:8080/${username}/folders`);
  //const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/users`);
  return response.json();
}

export async function getFolderMusics(username, folderName) {
  console.log("HEre", folderName);
  const response = await fetch(
    `http://localhost:8080/${username}/folders/${folderName}`
  );
  return response.json();
}
