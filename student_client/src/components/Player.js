import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getMusicContent } from "../services/api";
import { useEffect } from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { playCircleOutline, pauseCircleOutline } from "ionicons/icons";

export function Player({ musicId }) {
  const [url, setUrl] = useState(null);
  const { getAccessTokenSilently } = useAuth0();
  const [play, setPlay] = useState(true);

  useEffect(() => {
    getMusicContent(musicId, getAccessTokenSilently).then((blob) => {
      setUrl(URL.createObjectURL(blob));
    });
  }, [musicId, getAccessTokenSilently]);

  function Playing() {
    const bgm1 = document.querySelector(`#bgm${musicId}`);
    if (bgm1?.paused !== true) {
      setPlay(true);
      bgm1.pause();
    } else {
      setPlay(false);
      bgm1.play();
    }
  }

  return (
    <div>
      {" "}
      <audio id={`bgm${musicId}`} preload loop src={url} />
      <IonButton
        className="button is-rounded is-small"
        size="large"
        id={`btn${musicId}-play`}
        fill="clear"
        onClick={() => {
          Playing();
        }}
      >
        <IonIcon icon={play ? playCircleOutline : pauseCircleOutline}></IonIcon>
      </IonButton>
    </div>
  );
}
