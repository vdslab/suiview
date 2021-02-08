async function request(path, method, getAccessToken, body = null) {
  try {
    const url = `${process.env.REACT_APP_API_ENDPOINT}${path}`;
    const token = await getAccessToken({
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    });
    const options = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (body) {
      options.body = body;
    }
    return fetch(url, options);
  } catch (e) {
    console.error(e);
  }
}

export function requestGet(path, getAccessToken) {
  return request(path, "GET", getAccessToken);
}

export function requestPost(path, body, getAccessToken) {
  return request(path, "POST", getAccessToken, body);
}

export function requestPut(path, body, getAccessToken) {
  return request(path, "PUT", getAccessToken, body);
}

export function requestDelete(path, getAccessToken) {
  return request(path, "DELETE", getAccessToken);
}
