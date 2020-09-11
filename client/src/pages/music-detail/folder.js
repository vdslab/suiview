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
  IonListHeader,
  IonSelect,
  IonSelectOption,
  IonItemDivider,
  IonIcon,
  IonAlert,
} from "@ionic/react";
import { add, chevronForwardOutline, trashOutline } from "ionicons/icons";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveParallelCoordinates } from "@nivo/parallel-coordinates";

import FolderDetail from "./folder_detail/detail";

//import convertDate from "../root/index";

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
  return createdDay;
};

const DeleteFolder = (id) => {
  console.log("Delete function");
  console.log(id);

  window
    .fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/1/musics/delete_folder/${id}`,
      {
        method: "DELETE",
      }
    )
    .then((response) => response.text())
    .then((text) => {
      console.log(text);
      window.location.href = "/";
    });

  //window.location.href = "/";
};

const Folder = () => {
  const { folderId } = useParams();
  const [foldersData, setFoldersData] = useState([]);
  const [musics, setMusics] = useState([]);
  const [folderName, setFolderName] = useState();
  const [showAlert3, setShowAlert3] = useState(false);

  useEffect(() => {
    window
      .fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/1/musics/folders/${folderId}`
      )
      .then((response) => response.json())
      .then((folderName) => {
        setFolderName(folderName);
      });
  }, []);

  useEffect(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics/folders`)
      .then((response) => response.json())
      .then((foldersData) => {
        setFoldersData(foldersData);
      });
  }, []);

  useEffect(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics`)
      .then((response) => response.json())
      .then((musics) => {
        setMusics(musics);
      });
  }, []);

  const folder_ids = foldersData.filter((input) => input.folder_id == folderId);
  const music_ids = Array.from(
    new Set(
      folder_ids.map((input) => {
        return input.music_id;
      })
    )
  );

  console.log(music_ids);
  const musicData = musics.filter((input) => {
    for (let i = 0; i < music_ids.length; i++) {
      if (input.id == music_ids[i]) {
        return input;
      }
    }
  });

  console.log(music_ids.length);

  musicData.sort(function (a, b) {
    if (a.id < b.id) {
      return -1;
    } else {
      return 1;
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>

          <IonItem>
            <IonTitle>
              Folder{folderId} {folderName}
            </IonTitle>
            <IonButton
              slot="end"
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
              message={`本当に Folder.${folderId}を削除しますか？`}
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
                    DeleteFolder(folderId);
                    console.log("Deleeeete");
                  },
                },
              ]}
            />
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonCard>
          <IonItem lines="none">
            <h1>Chart</h1>
          </IonItem>
          {music_ids.length > 0 ? (
            <FolderDetail id={folderId} />
          ) : (
            <IonItem>
              {" "}
              <p>データがありません。トラックを追加してください</p>
            </IonItem>
          )}
          {/*} <FolderDetail id={folderId} />*/}
        </IonCard>

        <IonList>
          {musicData.map(({ created, id, name }) => {
            return (
              <IonCard>
                <IonItem>
                  play
                  <audio
                    controls
                    src={`${process.env.REACT_APP_API_ENDPOINT}/1/musics/${id}/content`}
                  />
                </IonItem>
                <IonItem>
                  No.{id}:{name} &emsp;{convertDate(created)}
                  <IonButton
                    slot="end"
                    fill="clear"
                    key={id}
                    routerLink={`/detail/${id}`}
                  >
                    <IonIcon icon={chevronForwardOutline} color="primary" />
                  </IonButton>
                </IonItem>
              </IonCard>
            );
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Folder;
