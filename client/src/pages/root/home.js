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
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  useIonViewWillEnter,
} from "@ionic/react";
import {
  chevronForwardOutline,
  trashOutline,
  settingsOutline,
} from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { musicRecord, saveAudio, useFetch_get } from "./index";
import { request_folder_list } from "../../serviceWorker/index";
/////////////////////////////////////////////
const Home = () => {
  const [folderData, setFolderData] = useState();

  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  useIonViewWillEnter(() => {
    request_folder_list(getAccessTokenSilently).then((data) => {
      setFolderData(data);
    });
  }, []);
  console.log(folderData);

  /*musics.sort((a, b) => {
    if (a.id > b.id) {
      return 1;
    } else {
      return -1;
    }
  });*/

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="start" fill="clear">
            <IonIcon icon={settingsOutline}></IonIcon>
          </IonButton>
          <IonTitle>musicvis</IonTitle>
          <IonButton
            slot="end"
            color="light"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Log out
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonListHeader>Folders</IonListHeader>
          <IonItemSliding>
            <IonItem
              _ngcontent-yfv-c79=""
              onClick={() => {
                // history.push(`/detail/${d.id}/from_future`);
              }}
              detail="false"
              target="_blank"
              class="item md item-lines-full in-list ion-activatable ion-focusable item-label hydrated"
            >
              すべて
              <IonButton slot="end" fill="clear">
                <IonIcon icon={chevronForwardOutline}></IonIcon>
              </IonButton>
            </IonItem>
            <IonItemOptions>
              <IonItemOption color="danger" expandable onClick={() => {}}>
                delete
              </IonItemOption>
            </IonItemOptions>
          </IonItemSliding>
          {folderData != undefined
            ? folderData.map((data, id) => {
                return (
                  <IonItemSliding key={id}>
                    <IonItem
                      _ngcontent-yfv-c79=""
                      onClick={() => {
                        // history.push(`/detail/${d.id}/from_future`);
                      }}
                      detail="false"
                      target="_blank"
                      class="item md item-lines-full in-list ion-activatable ion-focusable item-label hydrated"
                    >
                      <IonLabel>{data.name}</IonLabel>
                      <IonButton slot="end" fill="clear">
                        <IonIcon icon={chevronForwardOutline}></IonIcon>
                      </IonButton>
                    </IonItem>
                    <IonItemOptions>
                      <IonItemOption
                        color="danger"
                        expandable
                        onClick={() => {}}
                      >
                        delete
                      </IonItemOption>
                    </IonItemOptions>
                  </IonItemSliding>
                );
              })
            : []}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
