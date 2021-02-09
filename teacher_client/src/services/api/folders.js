export async function getFolders(username) {
  const response = await fetch(`http://localhost:8080/${username}/folders`);
  //const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/users`);
  return response.json();
}

export async function getFolderMusics(username, folderId) {
  const response = await fetch(
    `http://localhost:8080/${username}/folders/${folderId}`
  );
  return response.json();
}

export async function getFolderProgress(username, folderId) {
  const response = await fetch(
    `http://localhost:8080/${username}/folders/${folderId}/progress`
  );
  return response.json();
}

export async function getFolderDecibel(username, folderId) {
  const response = await fetch(
    `http://localhost:8080/${username}/folders/${folderId}/decibel`
  );
  return response.json();
}

export async function getFolderF0(username, folderId) {
  const response = await fetch(
    `http://localhost:8080/${username}/folders/${folderId}/f0`
  );
  return response.json();
}

export async function getFolderParallel(username, folderId) {
  const response = await fetch(
    `http://localhost:8080/${username}/folders/${folderId}/parallel`
  );
  return response.json();
}

export async function getFolderTone(username, folderId) {
  const response = await fetch(
    `http://localhost:8080/${username}/folders/${folderId}/tone`
  );
  return response.json();
}

export async function getMusicDecibel(username, folderId) {
  const response = await fetch(
    `http://localhost:8080/${username}/folders/${folderId}/progress`
  );
  return response.json();
}

export async function getMusicF0(username, folderId) {
  const response = await fetch(
    `http://localhost:8080/${username}/folders/${folderId}/progress`
  );
  return response.json();
}
