import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getMusicContent } from "../services/api";
import { useParams } from "react-router-dom";

export function Player() {
  const [url, setUrl] = useState(null);
  const { userName, musicId } = useParams();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getMusicContent(userName, musicId, getAccessTokenSilently).then((blob) => {
      setUrl(URL.createObjectURL(blob));
    });
  }, [userName, musicId, getAccessTokenSilently]);
  return <audio controls src={url} />;
}
