import React, { useState } from "react";
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
  IonFooter,
  IonAlert,
} from "@ionic/react";
import {
  chevronForwardOutline,
  settingsOutline,
  folderOutline,
  micOutline,
} from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import {
  request_folder_list,
  request_del_folder,
  request_add_folder,
} from "../services";
/////////////////////////////////////////////
const Home = ({ history }) => {
  const [folderData, setFolderData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

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

  const addFol = (name) => {
    console.log(name);
    request_add_folder(name, getAccessTokenSilently).then((data) => {
      setFolderData(data);
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton
            slot="start"
            fill="clear"
            //href="/setting"
            onClick={() => {
              history.push("/setting");
            }}
          >
            <IonIcon icon={settingsOutline}></IonIcon>
          </IonButton>
          <IonTitle>musicvis</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonListHeader>Folders</IonListHeader>

          <IonItem
            _ngcontent-yfv-c79=""
            onClick={() => {
              history.push(`/folder/all`);
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

          {folderData != null
            ? folderData.map((data, id) => {
                return (
                  <IonItemSliding key={id}>
                    <IonItem
                      _ngcontent-yfv-c79=""
                      onClick={() => {
                        history.push(`/folder/${data.id}`);
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
                          delFolder(data.id);
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
          <IonButton
            slot="end"
            fill="clear"
            onClick={() => history.push(`/recording/all`)}
          >
            <IonIcon icon={micOutline}></IonIcon>
          </IonButton>
        </IonToolbar>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass="my-custom-class"
          header={"新規フォルダ"}
          subHeader={"フォルダの名前を記入してください"}
          inputs={[
            {
              name: "name",
              type: "text",
              placeholder: "名前",
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
              handler: (data) => {
                addFol(data.name);
              },
            },
          ]}
        />
      </IonFooter>
    </IonPage>
  );
};

export default Home;
