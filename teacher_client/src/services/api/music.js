export async function getMusicContent(userName, musicId) {
  const response = await fetch(
    `http://localhost:8080/${userName}/musics/${musicId}/content`
  );
  //const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/users`);
  return response.blob();
}

export async function getMusicF0(userName, musicId) {
  console.log("!!!!!!!!!!!!!!!!!!");
  const response = await fetch(
    `http://localhost:8080/${userName}/musics/${musicId}/f0`
  );
  //const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/users`);
  return response.json();
}

/*
export async function getMusicContent(musicId, getAccessToken) {
    const response = await requestGet(
      `/musics/${musicId}/content`,
      getAccessToken
    );
    return response.blob();
  }*/
