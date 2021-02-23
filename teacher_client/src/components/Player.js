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

  function Playing() {
    const bgm1 = document.querySelector("#bgm1"); // <audio>
    const btn = document.querySelector("#btn-play"); // <button>
    console.log(bgm1?.paused);
    console.log("clicked");

    if (bgm1?.paused !== true) {
      btn.innerHTML = '<i class="fas fa-play">play</i>';
      bgm1.pause();
      console.log("Stop");
    } else {
      btn.innerHTML = '<i class="fas fa-play">stop</i>';
      bgm1.play();
      console.log("start");
    }
  }

  return (
    <div>
      {/*<audio controls src={url} />*/}
      <audio id="bgm1" preload loop src={url} />
      <button
        className="button is-rounded"
        id="btn-play"
        type="button"
        onClick={() => {
          Playing();
        }}
      >
        <i class="fas fa-play">play</i>
      </button>
    </div>
  );
}
