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

export const request_del_folder = async (id, getAccessTokenSilently) => {
  try {
    const token = await getAccessTokenSilently({
      audience: "https://musicvis",
      scope: "read:posts",
    });
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/1/musics/delete_folder/${id}`,
      {
        method: "DELETE",
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

export const request_add_folder = async (item, getAccessTokenSilently) => {
  try {
    const token = await getAccessTokenSilently({
      audience: "https://musicvis",
      scope: "read:posts",
    });
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/1/musics/folder_name`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: item,
      }
    );
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const request_music_list = async (id, getAccessTokenSilently) => {
  let url = `${process.env.REACT_APP_API_ENDPOINT}/musics`;
  if (id !== "all") {
    url = `${process.env.REACT_APP_API_ENDPOINT}/musics/folder/${id}`;
  }
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
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const request_del_music = async (id, getAccessTokenSilently) => {
  try {
    const token = await getAccessTokenSilently({
      audience: "https://musicvis",
      scope: "read:posts",
    });
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/1/musics/delete/${id}`,
      {
        method: "DELETE",
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

export const request_folder_name = async (id, getAccessTokenSilently) => {
  if (id === "all") {
    return "すべて";
  }

  try {
    const token = await getAccessTokenSilently({
      audience: "https://musicvis",
      scope: "read:posts",
    });
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/1/musics/folder_name/${id}`,
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

export const request_music_name = async (id, getAccessTokenSilently) => {
  try {
    const token = await getAccessTokenSilently({
      audience: "https://musicvis",
      scope: "read:posts",
    });
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${id}/music_name`,
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

export const request_comment_list = async (id, getAccessTokenSilently) => {
  try {
    const token = await getAccessTokenSilently({
      audience: "https://musicvis",
      scope: "read:posts",
    });
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${id}/comments`,
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

export const request_add_music = async (item, getAccessTokenSilently) => {
  try {
    const token = await getAccessTokenSilently({
      audience: "https://musicvis",
      scope: "read:posts",
    });
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/1/musics`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: item,
      }
    );
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const request_change_music_name = async (
  item,
  musicId,
  getAccessTokenSilently
) => {
  try {
    const token = await getAccessTokenSilently({
      audience: "https://musicvis",
      scope: "read:posts",
    });
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/1/musics/change_name/${musicId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: item,
      }
    );
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
