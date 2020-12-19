import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonBackButton,
  IonButton,
  IonInput,
  IonCard,
  IonList,
  IonSelect,
  IonSelectOption,
  IonIcon,
  useIonViewWillEnter,
  IonActionSheet,
  IonListHeader,
  IonFooter,
} from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  request_music_name,
  request_comment_list,
  request_change_music_name,
} from "../services";
import {
  closeOutline,
  ellipsisHorizontalCircleOutline,
  trash,
  close,
} from "ionicons/icons";
import ShowFrequency from "../chart/page/frequency";
import Decibel from "../chart/page/decibel";
import CentroidRolloff from "../chart/page/centroid_rolloff";

const ShowChart = (musicId, kind) => {
  if (musicId == null) {
    return null;
  }
  if (kind === "pitch") {
    console.log("here");
    return (
      <div>
        <ShowFrequency musicId={musicId} />
      </div>
    );
  } else if (kind === "vol") {
    return (
      <div>
        <Decibel musicId={musicId} />
      </div>
    );
  } else if (kind === "tone") {
    return (
      <div>
        <CentroidRolloff musicId={musicId} />
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
    /*"SPECTRUM FLATNESS",
    "FOURIER",
    "AMPLITUDE",
    "SPECTROGRAM",*/
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
          {chartIds.map((id, k) => {
            return (
              <IonSelectOption value={id} key={k}>
                {id}
              </IonSelectOption>
            );
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

  const { getAccessTokenSilently } = useAuth0();

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

  const changeName = () => {
    console.log("here");
    request_change_music_name(name, musicId, getAccessTokenSilently);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonBackButton
            slot="start"
            fill="clear"
            defaultHref={`/folder/${folderId}`}
            icon={closeOutline}
          ></IonBackButton>
          {/*<IonButton
            fill="clear"
            slot="start"
            onClick={() => {
              history.push(`/folder/${folderId}`);
            }}
          >
            <IonIcon icon={closeOutline}></IonIcon>
          </IonButton>*/}
          <IonTitle>
            <IonItem lines="none">
              <IonInput
                value={name}
                onIonChange={(e) => {
                  setName(e.detail.value);
                }}
              ></IonInput>
              <IonButton slot="end" fill="outline" onClick={() => changeName()}>
                名前を変更する
              </IonButton>
            </IonItem>
          </IonTitle>
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
              text: "フォルダの移動",
              icon: ellipsisHorizontalCircleOutline,
              handler: () => {
                history.push(
                  `/select_folder/${musicId}/folder/${folderId}/from/detail`,
                );
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
