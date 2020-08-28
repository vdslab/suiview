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

const Folder = () => {
  const { folderId } = useParams();
  const [foldersData, setFoldersData] = useState([]);
  const [musics, setMusics] = useState([]);
  const [folderName, setFolderName] = useState();

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
          <IonTitle>
            Folder{folderId} {folderName}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
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

        <IonCard>
          <IonItem lines="none">
            <h1>Chart</h1>
          </IonItem>
          <FolderDetail id={folderId} />
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Folder;
