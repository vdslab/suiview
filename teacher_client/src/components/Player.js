import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getMusicContent } from "../services/api";

export function Player() {
  const [url, setUrl] = useState(null);
  //const { getAccessTokenSilently } = useAuth0();
  const path = decodeURI(location.pathname).split("/");
  const username = path[1];
  const musicId = path[4];
  console.log(musicId);

  useEffect(() => {
    getMusicContent(username, musicId).then((blob) => {
      setUrl(URL.createObjectURL(blob));
    });
  }, []);
  return <audio controls src={url} />;
}
