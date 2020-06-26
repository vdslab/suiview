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
} from "@ionic/react";
import { add, chevronForwardOutline } from "ionicons/icons";
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

const Folder = () => {
  const { folderId } = useParams();
  const [folderData, setFolderData] = useState([]);
  const [musics, setMusics] = useState([]);
  useEffect(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics/folders`)
      .then((response) => response.json())
      .then((folderData) => {
        setFolderData(folderData);
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

  console.log(folderId);
  const folder_ids = folderData.filter((input) => input.folder_id == folderId);
  const music_ids = Array.from(
    new Set(
      folder_ids.map((input) => {
        return input.music_id;
      })
    )
  );

  console.log(musics);
  const musicData = musics.filter((input) => {
    for (let i = 0; i < music_ids.length; i++) {
      if (input.id == music_ids[i]) {
        return input;
      }
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Folder{folderId}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          {musicData.map(({ created, id }) => {
            return (
              <IonCard>
                <IonItem>
                  track{id} {convertDate(created)}
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
