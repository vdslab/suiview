export const request = async (url, getAccessTokenSilently) => {
  try {
    const token = await getAccessTokenSilently({
      audience: "https://musicvis",
      scope: "read:posts",
    });
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // body: JSON.stringify(token),
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const request_folder_list = async (getAccessTokenSilently) => {
  try {
    const token = await getAccessTokenSilently({
      audience: "https://musicvis",
      scope: "read:posts",
    });
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/1/musics/folders2`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
