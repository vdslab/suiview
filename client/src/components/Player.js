import { useState } from "react";
import { useIonViewWillEnter } from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import { getMusicContent } from "../services/api";

export function Player({ musicId }) {
  const [url, setUrl] = useState(null);
  const { getAccessTokenSilently } = useAuth0();
  useIonViewWillEnter(() => {
    getMusicContent(musicId, getAccessTokenSilently).then((blob) => {
      setUrl(URL.createObjectURL(blob));
    });
  }, []);
  return <audio controls src={url} />;
}
