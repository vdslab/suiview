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
const Setting = ({ history }) => {
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
          <IonTitle>設定</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        　
        <IonList>
          <IonButton
            slot="end"
            expand="full"
            color="light"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Log out
          </IonButton>{" "}
          　　　　
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Setting;
