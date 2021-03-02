import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getMusicContent } from "../services/api";
import { useParams } from "react-router-dom";

export function Player(data) {
  const [url, setUrl] = useState(null);
  const { userName } = useParams();
  const [play, setPlay] = useState(true);
  const { getAccessTokenSilently } = useAuth0();
  const musicId = data.id;
  console.log(play);

  useEffect(() => {
    getMusicContent(userName, musicId, getAccessTokenSilently).then((blob) => {
      setUrl(URL.createObjectURL(blob));
    });
  }, [userName, musicId, getAccessTokenSilently]);

  function Playing() {
    const bgm1 = document.querySelector(`#bgm${musicId}`);
    bgm1.addEventListener("ended", function () {
      setPlay(true);
    });
    if (bgm1?.paused !== true) {
      setPlay(true);
      bgm1.pause();
    } else {
      setPlay(false);
      bgm1.play();
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <audio id={`bgm${musicId}`} src={url} />
      <button
        className="button is-rounded is-small"
        id={`bgm${musicId}`}
        onClick={() => {
          Playing();
        }}
      >
        {play ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        )}
      </button>
    </div>
  );

  /*function Playing() {
    const bgm1 = document.querySelector(`#bgm${musicId}`); // <audio>
    const btn = document.querySelector(`#btn${musicId}-play`); // <button>
    console.log(bgm1?.paused);
    console.log("clicked");

    if (bgm1?.paused !== true) {
      btn.innerHTML = `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>`;
      bgm1.pause();
      console.log("Stop", musicId);
    } else {
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000000"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </button>
    </div>
  );*/
}
