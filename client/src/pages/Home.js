import { useState } from "react";
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
import { getFolders, deleteFolder, postFolder } from "../services/api";

const Home = () => {
  const [folders, setFolders] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  useIonViewWillEnter(async () => {
    const data = await getFolders(getAccessTokenSilently);
    setFolders(data);
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="start" fill="clear" routerLink="/setting">
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
            routerLink="/folder/all"
            detail="false"
            class="item md item-lines-full in-list ion-activatable ion-focusable item-label hydrated"
          >
            すべて
            <IonButton slot="end" fill="clear">
              <IonIcon icon={chevronForwardOutline}></IonIcon>
            </IonButton>
          </IonItem>

          {folders.map((data) => {
            return (
              <IonItemSliding key={data.id}>
                <IonItem
                  _ngcontent-yfv-c79="" // これは…?
                  detail="false"
                  routerLink={`/folder/${data.id}`}
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
                    onClick={async () => {
                      await deleteFolder(data.id, getAccessTokenSilently);
                      const folders = await getFolders(getAccessTokenSilently);
                      setFolders(folders);
                    }}
                  >
                    delete
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            );
          })}
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
          <IonButton slot="end" fill="clear" routerLink="/recording/all">
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
              handler: async ({ name }) => {
                await postFolder({ name }, getAccessTokenSilently);
                const data = await getFolders(getAccessTokenSilently);
                setFolders(data);
              },
            },
          ]}
        />
      </IonFooter>
    </IonPage>
  );
};

export default Home;
