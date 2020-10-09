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
import { useFetch_get } from "../root/index";
import { convertDate } from "../root/index";

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

const DeleteFromFolder = (folderId, musicId) => {
  console.log("Delete function");
  console.log(musicId);

  window
    .fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/1/musics/delete/${musicId}/from/${folderId}`,
      {
        method: "DELETE",
      }
    )
    .then((response) => response.text())
    .then((text) => {
      console.log(text);
      window.location.href = `/folder/${folderId}`;
    });

  //window.location.href = "/";
};

const Folder = () => {
  //const [foldersData, setFoldersData] = useState([]);
  //const [musics, setMusics] = useState([]);
  const { folderId } = useParams();
  const foldersData = useFetch_get(
    `${process.env.REACT_APP_API_ENDPOINT}/1/musics/folders`
  );

  const musics = useFetch_get(`${process.env.REACT_APP_API_ENDPOINT}/1/musics`);
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

  /*useEffect(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics/folders`)
      .then((response) => response.json())
      .then((foldersData) => {
        setFoldersData(foldersData);
      });
  }, []);*/

  /*useEffect(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics`)
      .then((response) => response.json())
      .then((musics) => {
        setMusics(musics);
      });
  }, []);*/

  console.log(foldersData);
  const folder_ids = foldersData.filter((input) => input.folder_id == folderId);
  const music_ids = Array.from(
    new Set(
      folder_ids.map((input) => {
        return input.music_id;
      })
    )
  );

  //console.log(music_ids);
  const musicData = musics.filter((input) => {
    for (let i = 0; i < music_ids.length; i++) {
      if (input.id == music_ids[i]) {
        return input;
      }
    }
  });

  //console.log(music_ids.length);

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
                    message={`本当に Folder.${folderId}から track${id}を削除しますか？`}
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
                          DeleteFromFolder(folderId, id);
                          console.log("Deleeeete");
                        },
                      },
                    ]}
                  />
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
