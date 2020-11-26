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
  IonFab,
  IonFabButton,
  IonFooter,
  IonAlert,
} from "@ionic/react";
import {
  chevronForwardOutline,
  add,
  settingsOutline,
  folderOutline,
  micOutline,
} from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { musicRecord, saveAudio, useFetch_get } from "./index";
import {
  request_folder_list,
  request_del_folder,
} from "../../serviceWorker/index";
/////////////////////////////////////////////
const Home = ({ history }) => {
  const [folderData, setFolderData] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [newFolName, setNewFolName] = useState();
  const [newFolText, setNewFolText] = useState();

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

  const delFolder = (id) => {
    console.log("del", id);
    request_del_folder(id, getAccessTokenSilently).then((data) => {
      setFolderData(data);
    });
  };

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
                        onClick={() => {
                          setFolderData(delFolder(data.id));
                        }}
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
      <IonFooter>
        <IonToolbar>
          <IonButton
            slot="start"
            fill="clear"
            onClick={() => setShowAlert(true)}
          >
            <IonIcon icon={folderOutline}></IonIcon>
          </IonButton>
          <IonButton slot="end" fill="clear">
            <IonIcon icon={micOutline}></IonIcon>
          </IonButton>
        </IonToolbar>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass="my-custom-class"
          header={"新規フォルダ"}
          subHeader={"このフォルダの名前と詳細を記入してください"}
          inputs={[
            {
              name: "name1",
              type: "text",
              value: newFolName,
              placeholder: "名前",
            },
            {
              name: "name2",
              type: "textarea",
              value: newFolText,
              placeholder: "詳細(任意)",
            },
          ]}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
              handler: () => {
                console.log("Confirm Cancel");
              },
            },
            {
              text: "Ok",
              handler: () => {
                console.log(newFolName);
              },
            },
          ]}
          onIonChange={(e) => setNewFolName(e.target.value)}
        />
      </IonFooter>
    </IonPage>
  );
};

export default Home;
