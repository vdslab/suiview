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
import convertDate from "../root/index";

const Folder = () => {
  const { folderId } = useParams();
  const [folderData, setFolderData] = useState([]);
  useEffect(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics/folders`)
      .then((response) => response.json())
      .then((folderData) => {
        setFolderData(folderData);
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
  console.log(music_ids);

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
        <ionList>
          {music_ids.map((id) => {
            return (
              <IonCard>
                <IonItem>
                  track{id} {/*convertDate(created)*/}
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
        </ionList>
      </IonContent>
    </IonPage>
  );
};

export default Folder;
