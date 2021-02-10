import { useEffect, useState } from "react";
//import { useAuth0 } from "@auth0/auth0-react";
import { getMusicContent } from "../services/api";
import { useParams } from "react-router-dom";

export function Player() {
  const [url, setUrl] = useState(null);
  const { userName, musicId } = useParams();
  console.log(userName, musicId);
  useEffect(() => {
    getMusicContent(userName, musicId).then((blob) => {
      setUrl(URL.createObjectURL(blob));
    });
  }, [userName, musicId]);
  return <audio controls src={url} />;
}
