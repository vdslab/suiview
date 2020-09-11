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

//export したのだとバグる
const FolderName = ({ id }) => {
  const [folderName, setFolderName] = useState();
  useEffect(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics/folders/${id}`)
      .then((response) => response.json())
      .then((folderName) => {
        setFolderName(folderName);
      });
  }, []);
  //console.log(id);
  return <div>{folderName}</div>;
};

//index.js で export したのをimportするとなんかおかしくなる
const convertDate = (input) => {
  if (input === null) {
    return "";
  }

  const d = new Date(`${input} UTC`);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const date = `${d.getDate()}`.padStart(2, "0");
  const hour = `${d.getHours()}`.padStart(2, "0");
  const minute = `${d.getMinutes()}`.padStart(2, "0");
  const createdDay =
    year + "/" + month + "/" + date + "/" + hour + ":" + minute;
  //console.log(createdDay);
  return createdDay;
};

const SaveComment = (comment, musicId) => {
  window.fetch(
    `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/comments`,
    {
      method: "PUT",
      body: comment,
    }
  );
};

const SaveFolder = (folderId, musicId) => {
  let folder_ids = "";
  folderId.map((input) => {
    folder_ids += input + ",";
  });
  window.fetch(
    `${process.env.REACT_APP_API_ENDPOINT}/1/musics/put_folders/${musicId}`,
    {
      method: "PUT",
      body: folder_ids,
    }
  );
};

const changeName = (name, musicId) => {
  console.log(musicId);
  window.fetch(
    `${process.env.REACT_APP_API_ENDPOINT}/1/musics/change_name/${musicId}`,
    {
      method: "PUT",
      body: name,
    }
  );
};

const DeleteComment = (id, musicId) => {
  console.log(musicId);
  window
    .fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/1/musics/delete_comment/${id}`,
      {
        method: "DELETE",
      }
    )
    .then((response) => response.text())
    .then((text) => {
      console.log(text);
      window.location.href = `/detail/${musicId}`; //こういう使い方でいいのか
    });
};

const Comments = ({ data, musicId }) => {
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
                          DeleteComment(data[key].id, musicId);
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

const Delete = (id) => {
  window
    .fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics/delete/${id}`, {
      method: "DELETE",
    })
    .then((response) => response.text())
    .then((text) => {
      console.log(text);
      window.location.href = "/";
    });
};

const FrequencyChart = (musicId) => {
  if (musicId == null) {
    return null;
  }

  return (
    <div>
      <ShowFrequency musicId={musicId} />
    </div>
  );
};
const VolumeChart = () => {
  return <div>volume chart</div>;
};

const ToneChart = () => {
  return <div>ToneChart</div>;
};

const MusicDetail = () => {
  const [chartId, setChartId] = useState("PROGRESS");
  const chartIds = ["PROGRESS", "ALL", "PITCH", "VOL", "TONE"];
  const { musicId } = useParams();
  return (
    <div>
      <IonItem>
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
      {/*{chartId === "PROGRESS" ? ProgressChart(musicId) : []}
      {chartId === "ALL" ? ParallelChart(msuciId) : []}*/}
      {chartId === "PITCH" ? FrequencyChart(musicId) : []}
      {chartId === "VOL" ? VolumeChart(musicId) : []}
      {chartId === "TONE" ? ToneChart(musicId) : []}
    </div>
  );
};

const DetailPage = () => {
  const { musicId } = useParams();
  const [comment, setComment] = useState();
  const [text, setText] = useState();
  const [oldComment, setOldComment] = useState(null);
  const [folder, setFolder] = useState(null);
  const [folderData, setFolderData] = useState();
  const [folderId, setFolderId] = useState();
  const [musicName, setMusicName] = useState();
  const [showAlert3, setShowAlert3] = useState(false);

  useEffect(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics/folders2`)
      .then((response) => response.json())
      .then((folderData) => {
        setFolderData(folderData);
      });
  }, []);

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

  useEffect(() => {
    window
      .fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/comments`
      )
      .then((response) => response.json())
      .then((oldComment) => {
        setOldComment(oldComment);
      });
  }, []);
  // console.log(oldComment);

  useEffect(() => {
    window
      .fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/music_name`
      )
      .then((response) => response.json())
      .then((musicName) => {
        setMusicName(musicName);
      });
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>
            No{musicId} : {musicName}
          </IonTitle>
          <IonItem>
            名前の変更：
            <IonInput
              value={musicName}
              placeholder=""
              onIonChange={(e) => {
                setMusicName(e.detail.value);
              }}
            ></IonInput>
            <IonButton
              slot="end"
              onClick={() => {
                console.log(musicName, musicId);
                changeName(musicName, musicId);
              }}
            >
              【add】
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
                Delete(musicId);
                console.log("Deleeeete");
              },
            },
          ]}
        />
      </IonItem>

      <IonItem>
        <audio
          controls
          src={`${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/content`}
        />
      </IonItem>

      <IonCard>
        <IonItem>Detail</IonItem>
        <MusicDetail musicId={musicId} />
      </IonCard>

      <IonContent>
        <IonButton
          color="medium"
          key={musicId}
          routerLink={`/musics/${musicId}`}
        >
          amplitude
        </IonButton>
        <IonButton
          color="light"
          key={musicId}
          routerLink={`/fourier/${musicId}`}
        >
          fourier
        </IonButton>
        <IonButton
          color="medium"
          key={musicId}
          routerLink={`/spectrogram/${musicId}`}
        >
          spectrogram
        </IonButton>
        <IonButton
          color="light"
          key={musicId}
          routerLink={`/frequency/${musicId}`}
        >
          frequency
        </IonButton>
        <IonButton
          color="medium"
          key={musicId}
          routerLink={`/spectrum_centroid_and_rolloff/${musicId}`}
        >
          spectrum centroid/rolloff
        </IonButton>
        <IonButton
          color="light"
          key={musicId}
          routerLink={`/flatness/${musicId}`}
        >
          spectrum flatness
        </IonButton>
        <IonButton
          color="medium"
          key={musicId}
          routerLink={`/decibel/${musicId}`}
        >
          decibel
        </IonButton>

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
              onClick={() => SaveFolder(folderId, musicId)}
            >
              save
            </IonButton>
          </IonItem>
        </IonCard>

        <IonCard>
          <IonItem>
            <IonButton
              slot="end"
              onClick={() => {
                SaveComment(text, musicId);
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
          <Comments data={oldComment} musicId={musicId} />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default DetailPage;
