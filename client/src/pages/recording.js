import React, { useEffect, useState } from "react";
import {
  IonHeader,
  IonItem,
  IonList,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButton,
  IonIcon,
  IonLabel,
  IonListHeader,
  IonBackButton,
  IonChip,
  IonInput,
  IonTextarea,
  IonCard,
  IonFooter,
  IonGrid,
  IonCol,
  IonRow,
} from "@ionic/react";
import {
  chevronForwardOutline,
  closeOutline,
  settingsOutline,
  folderOutline,
  micOutline,
  radioButtonOnOutline,
} from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { musicRecord, saveAudio, useFetch_get } from "../pages/root/index";
import {
  request_folder_list,
  request_del_folder,
  request_add_folder,
} from "../serviceWorker/index";
import { useParams } from "react-router-dom";
/////////////////////////////////////////////
const Recording = ({ history }) => {
  const [musicName, setMusicName] = useState();
  const [comment, setComment] = useState();
  const item = useParams();
  const folName = item.foldername;

  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonBackButton slot="start" defaultHref="/" icon={closeOutline} />
          <IonTitle>記録する</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonListHeader lines="full">
            フォルダ名 &emsp; {folName}
          </IonListHeader>
          <IonItem>
            <IonLabel>名前&ensp;</IonLabel>
            <IonInput
              value={musicName}
              placeholder="music name"
              onIonChange={(e) => setMusicName(e.detail.value)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>コメント</IonLabel>
            <IonTextarea
              placeholder=""
              value={comment}
              onIonChange={(e) => setComment(e.detail.value)}
            ></IonTextarea>
          </IonItem>
        </IonList>
        　　　　 　　　　
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButton expand="full">
            <IonIcon icon={radioButtonOnOutline}></IonIcon>
          </IonButton>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton expand="full">やり直す</IonButton>
              </IonCol>
              <IonCol>
                <IonButton expand="full">記録する</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Recording;
