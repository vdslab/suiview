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
} from "@ionic/react";
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

const Comments = ({ data, musicId, token }) => {
  return (
    <div>
      <IonCard>
        <IonItem color="medium">Comment Log</IonItem>
        {data
          ? Object.keys(data).map((key) => {
              return (
                <div>
                  <IonList>
                    {/*} <IonLabel>{convertDate(data[key].created)}</IonLabel>*/}
                    <IonItem lines="none">
                      {convertDate(data[key].created)}
                      <IonButton
                        slot="end"
                        expand="block"
                        color="danger"
                        onClick={() => {
                          DeleteComment(data[key].id, musicId, token);
                        }}
                      >
                        <IonIcon icon={trashOutline} color="light" />
                      </IonButton>
                    </IonItem>
                    <IonItem>{data[key].comment}</IonItem>
                  </IonList>
                </div>
              );
            })
          : ""}
      </IonCard>
    </div>
  );
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

const ShowChart = (musicId, kind) => {
  if (musicId == null) {
    return null;
  }
  if (kind == "freq") {
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
  } else if (kind == "flat") {
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
  }
};

const TrackDetail = () => {
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
      {chartId === "PITCH" ? ShowChart(musicId, "freq") : []}
      {chartId === "VOL" ? ShowChart(musicId, "vol") : []}
      {chartId === "TONE" ? ShowChart(musicId, "tone") : []}
      {chartId === "SPECTRUM FLATNESS" ? ShowChart(musicId, "flat") : []}
      {chartId === "FOURIER" ? ShowChart(musicId, "fourier") : []}
      {chartId === "AMPLITUDE" ? ShowChart(musicId, "amplitude") : []}
      {chartId === "SPECTROGRAM" ? ShowChart(musicId, "spect") : []}
    </div>
  );
};

const DetailPage = () => {
  const { musicId } = useParams();
  const [text, setText] = useState();
  const oldComment = useFetch_get(
    `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/comments`
  );
  const folderData = useFetch_get(
    `${process.env.REACT_APP_API_ENDPOINT}/1/musics/folders2`
  );
  const [folderId, setFolderId] = useState();
  const [musicName, setMusicName] = useState();
  const [showAlert3, setShowAlert3] = useState(false);
  const user_id = useFetch_get(`${process.env.REACT_APP_API_ENDPOINT}/user_id`);
  const token = useGetToken();

  const name = useFetch_get(
    `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/music_name`
  );
  console.log(name);

  /*useEffect(() => {
    window
      .fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/music_name`,
        {
          headers: {
            Authorization: `Bearer ${token}`, //ここのtokenが空でエラーになってる
          },
        }
      )
      .then((response) => response.json())
      .then((musicName) => {
        setMusicName(musicName);
      });
  }, []);*/

  let folder_ids = null;
  if (folderData !== undefined) {
    folder_ids = Array.from(
      new Set(
        folderData.map((input) => {
          return input.id;
        })
      )
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>
            No{musicId} : {name}
          </IonTitle>
          <IonItem>
            名前の変更：
            <IonInput
              value={musicName}
              placeholder="記入してください"
              onIonChange={(e) => {
                setMusicName(e.detail.value);
              }}
            ></IonInput>
            <IonButton
              slot="end"
              onClick={() => {
                console.log(musicName, musicId);
                changeName(musicName, musicId, token);
              }}
            >
              【change】
            </IonButton>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonItem>
        <IonButton
          slot="start"
          expand="block"
          color="danger"
          onClick={() => {
            setShowAlert3(true);
          }}
        >
          <IonIcon icon={trashOutline} color="light" />
        </IonButton>
        <IonAlert
          isOpen={showAlert3}
          onDidDismiss={() => setShowAlert3(false)}
          cssClass="my-custom-class"
          header={"Confirm!"}
          message={`本当に track No.${musicId}を削除しますか？`}
          buttons={[
            {
              text: "Cancel",
              cssClass: "secondary",
              handler: () => {
                console.log("cancel");
              },
            },
            {
              text: "Yes",
              handler: () => {
                Delete(musicId, token);
                console.log("Deleeeete");
              },
            },
          ]}
        />
      </IonItem>

      <IonItem>
        <audio
          controls
          src={`${process.env.REACT_APP_API_ENDPOINT}/${user_id}/musics/${musicId}/content`}
        />
      </IonItem>
      <IonContent>
        <IonCard>
          <IonItem>登録するフォルダを選択</IonItem>
          <IonItem>
            <IonLabel>number</IonLabel>
            <IonSelect
              value={folderId}
              placeholder="select one"
              multiple={true}
              onIonChange={(e) => setFolderId(e.detail.value)}
            >
              {folder_ids
                ? folder_ids.map((id) => {
                    return (
                      <IonSelectOption value={id}>
                        No.{id} <FolderName id={id} />
                      </IonSelectOption>
                    );
                  })
                : ""}
            </IonSelect>
            <IonButton
              slot="end"
              color="dark"
              size="big"
              key={folderId}
              onClick={() => SaveFolder(folderId, musicId, token)}
            >
              save
            </IonButton>
          </IonItem>
        </IonCard>

        <IonCard>
          <IonItem>
            <h1>Detail</h1>
          </IonItem>
          <TrackDetail musicId={musicId} />
        </IonCard>

        <IonCard>
          <IonItem>
            <IonButton
              slot="end"
              onClick={() => {
                SaveComment(text, musicId, token);
                /*useFetch_put(
                  `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/comments`,
                  text
                );*/
              }}
            >
              【save】
            </IonButton>
          </IonItem>
          <IonItem>
            <IonTextarea
              rows={6}
              cols={20}
              placeholder="comment"
              value={text}
              onIonChange={(e) => setText(e.detail.value)}
            ></IonTextarea>
          </IonItem>
        </IonCard>

        <IonList>
          <Comments data={oldComment} musicId={musicId} token={token} />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default DetailPage;
