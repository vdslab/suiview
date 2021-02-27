import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getMusicContent } from "../services/api";
import { useEffect } from "react";

export function Player({ musicId }) {
  const [url, setUrl] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getMusicContent(musicId, getAccessTokenSilently).then((blob) => {
      setUrl(URL.createObjectURL(blob));
    });
  }, [musicId, getAccessTokenSilently]);

  return <audio controls src={url} />;
}
