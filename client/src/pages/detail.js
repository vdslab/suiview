import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonBackButton,
  IonButtons,
  IonButton,
  IonInput,
  IonCard,
  IonList,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonAlert,
  IonIcon,
  IonTextarea,
  IonItemOption,
  useIonViewWillEnter,
  IonActionSheet,
  IonListHeader,
  IonFooter,
} from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  request_music_name,
  request_del_music,
  request_folder_name,
  request_comment_list,
} from "../serviceWorker/index";
import {
  closeOutline,
  ellipsisHorizontalCircleOutline,
  trash,
  close,
} from "ionicons/icons";
import ShowFrequency from "../chart/page/frequency";
import Decibel from "../chart/page/decibel";
import Centroid_Rolloff from "../chart/page/centroid_rolloff";
/*
import { add, chevronForwardOutline, trashOutline } from "ionicons/icons";
import ShowFrequency from "./frequency";
import Decibel from "./decibel";
import Centroid_Rolloff from "./centroid_rolloff";
import Flatness from "./flatness";
import ShowFourier from "./fourier";
import MusicDetail from "./index";
import ShowSpectrogram from "./spectrogram";
import {
  useFetch_get,
  convertDate,
  FolderName,
  Fetch_put,
  useGetToken,
} from "../root/index";
import { useAuth0 } from "@auth0/auth0-react";

const SaveComment = (comment, musicId, token) => {
  Fetch_put(
    `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/comments`,
    comment,
    token
  );
};

const SaveFolder = (folderId, musicId, token) => {
  let folder_ids = "";
  folderId.map((input) => {
    folder_ids += input + ",";
  });
  Fetch_put(
    `${process.env.REACT_APP_API_ENDPOINT}/1/musics/put_folders/${musicId}`,
    folder_ids,
    token
  );
};

const changeName = (name, musicId, token) => {
  window
    .fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/1/musics/change_name/${musicId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: name,
      }
    )
    .then((response) => response.text())
    .then((text) => {
      // console.log(text);
      window.location.href = `/detail/${musicId}`; //こういう使い方でいいのか
    });
};

const DeleteComment = (id, musicId, token) => {
  //console.log(musicId);
  window
    .fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/1/musics/delete_comment/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => response.text())
    .then((text) => {
      // console.log(text);
      window.location.href = `/detail/${musicId}`; //こういう使い方でいいのか
    });
};

//error

const Delete = (id, token) => {
  window
    .fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.text())
    .then((text) => {
      console.log(text);
      window.location.href = "/";
    });
};
*/
const ShowChart = (musicId, kind) => {
  if (musicId == null) {
    return null;
  }
  if (kind == "pitch") {
    console.log("here");
    return (
      <div>
        <ShowFrequency musicId={musicId} />
      </div>
    );
  } else if (kind == "vol") {
    return (
      <div>
        <Decibel musicId={musicId} />
      </div>
    );
  } else if (kind == "tone") {
    return (
      <div>
        <Centroid_Rolloff musicId={musicId} />
      </div>
    );
  } /*else if (kind == "flat") {
    return (
      <div>
        <Flatness musicId={musicId} />
      </div>
    );
  } else if (kind == "fourier") {
    return (
      <div>
        <ShowFourier musicId={musicId} />
      </div>
    );
  } else if (kind == "amplitude") {
    return (
      <div>
        <MusicDetail musicId={musicId} />
      </div>
    );
  } else if (kind == "spect") {
    return (
      <div>
        <ShowSpectrogram musicId={musicId} />
      </div>
    );
  }*/
};

const Chartes = () => {
  const [chartId, setChartId] = useState("PITCH");
  const chartIds = [
    "PITCH",
    "VOL",
    "TONE",
    "SPECTRUM FLATNESS",
    "FOURIER",
    "AMPLITUDE",
    "SPECTROGRAM",
  ];
  const { musicId } = useParams();
  console.log(musicId);
  return (
    <div>
      <IonItem lines="none">
        <IonSelect
          value={chartId}
          placeholder={chartId}
          onIonChange={(e) => setChartId(e.detail.value)}
          buttons={["Cancel", "Open Modal", "Delete"]}
        >
          {chartIds.map((id) => {
            return <IonSelectOption value={id}>{id}</IonSelectOption>;
          })}
        </IonSelect>
      </IonItem>
      {chartId === "PITCH" ? ShowChart(musicId, "pitch") : []}
      {chartId === "VOL" ? ShowChart(musicId, "vol") : []}
      {chartId === "TONE" ? ShowChart(musicId, "tone") : []}
      {/*} {chartId === "SPECTRUM FLATNESS" ? ShowChart(musicId, "flat") : []}
      {chartId === "FOURIER" ? ShowChart(musicId, "fourier") : []}
      {chartId === "AMPLITUDE" ? ShowChart(musicId, "amplitude") : []}
        {chartId === "SPECTROGRAM" ? ShowChart(musicId, "spect") : []}*/}
    </div>
  );
};

const Detail = ({ history }) => {
  const { musicId } = useParams();
  const [name, setName] = useState();
  const { folderId } = useParams();
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [comments, setComments] = useState();

  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  useIonViewWillEnter(() => {
    request_music_name(musicId, getAccessTokenSilently).then((data) => {
      setName(data);
    });
  }, []);

  useIonViewWillEnter(() => {
    request_comment_list(musicId, getAccessTokenSilently).then((data) => {
      setComments(data);
    });
  }, []);
  console.log(comments);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton
            fill="clear"
            slot="start"
            onClick={() => {
              history.push(`/folder/${folderId}`);
            }}
          >
            <IonIcon icon={closeOutline}></IonIcon>
          </IonButton>
          <IonTitle>{name}</IonTitle>
          <IonButton
            slot="end"
            fill="clear"
            onClick={() => {
              setShowActionSheet(true);
            }}
          >
            <IonIcon icon={ellipsisHorizontalCircleOutline}></IonIcon>
          </IonButton>
        </IonToolbar>

        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          cssClass="my-custom-class"
          buttons={[
            {
              text: "削除(まだできない)",
              role: "destructive",
              icon: trash,
              handler: () => {
                console.log("Delete clicked");
              },
            },
            {
              text: "フォルダの移動(まだできない)",
              icon: ellipsisHorizontalCircleOutline,
              handler: () => {
                console.log("Share clicked");
              },
            },

            {
              text: "Cancel",
              icon: close,
              role: "cancel",
              handler: () => {
                console.log("Cancel clicked");
              },
            },
          ]}
        ></IonActionSheet>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonListHeader>詳細</IonListHeader>
          <IonCard>
            <Chartes />
          </IonCard>
        </IonList>
        <IonList>
          <IonListHeader>コメント</IonListHeader>
        </IonList>
      </IonContent>

      <IonFooter>
        {/*デザイン微妙*/}
        <IonToolbar>
          <IonList>
            <IonItem>
              {/*上手くいってない*/}
              <audio
                controls
                src={`${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/content`}
              />
            </IonItem>
            <IonButton fill="outline">コメントを書く</IonButton>
          </IonList>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Detail;
