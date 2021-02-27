import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getMusicContent } from "../services/api";
import { useParams } from "react-router-dom";

export function Player(data) {
  const [url, setUrl] = useState(null);
  const { userName } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const musicId = data.id;
  console.log(musicId);

  useEffect(() => {
    getMusicContent(userName, musicId, getAccessTokenSilently).then((blob) => {
      setUrl(URL.createObjectURL(blob));
    });
  }, [userName, musicId, getAccessTokenSilently]);

  function Playing() {
    const bgm1 = document.querySelector(`#bgm${musicId}`); // <audio>
    const btn = document.querySelector(`#btn${musicId}-play`); // <button>
    console.log(bgm1?.paused);
    console.log("clicked");

    if (bgm1?.paused !== true) {
      btn.innerHTML = '<i class="fas fa-play">p</i>';
      bgm1.pause();
      console.log("Stop", musicId);
    } else {
      btn.innerHTML = '<i class="fas fa-play">s</i>';
      bgm1.play();
      console.log("start", musicId);
    }
  }

  return (
    <div>
      <audio id={`bgm${musicId}`} preload loop src={url} />
      <button
        className="button is-rounded is-small"
        id={`btn${musicId}-play`}
        type="button"
        onClick={() => {
          Playing();
        }}
      >
        <i className="fas fa-play">s</i>
      </button>
    </div>
  );
}
