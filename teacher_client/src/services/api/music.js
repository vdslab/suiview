export async function getMusicContent(userName, musicId) {
  const response = await fetch(
    `${process.env.REACT_APP_API_ENDPOINT}/${userName}/musics/${musicId}/content`
  );
  //const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/users`);
  return response.blob();
}

export async function getMusicF0(userName, musicId) {
  const response = await fetch(
    `${process.env.REACT_APP_API_ENDPOINT}/${userName}/musics/${musicId}/f0`
  );
  //const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/users`);
  return response.json();
}

export async function getMusicDecibel(userName, musicId) {
  const response = await fetch(
    `${process.env.REACT_APP_API_ENDPOINT}/${userName}/musics/${musicId}/decibel`
  );
  //const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/users`);
  return response.json();
}

export async function getMusicSpectrumCentroid(username, musicId) {
  const response = await fetch(
    `${process.env.REACT_APP_API_ENDPOINT}/${username}/musics/${musicId}/centroid`
  );
  return response.json();
}

export async function getMusicSpectrumRolloff(username, musicId) {
  const response = await fetch(
    `${process.env.REACT_APP_API_ENDPOINT}/${username}/musics/${musicId}/rolloff`
  );
  return response.json();
}

export async function putMusicComment(username, musicId, comment, writer) {
  console.log(username, musicId);
  const response = await fetch(
    `${process.env.REACT_APP_API_ENDPOINT}/${username}/musics/${musicId}/comment`,
    {
      method: "POST",
      body: JSON.stringify({ comment: comment, writer: writer }),
    }
  );
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
