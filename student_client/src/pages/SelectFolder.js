import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  IonHeader,
  IonItem,
  IonList,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonLabel,
  IonListHeader,
  IonBackButton,
  IonFooter,
  IonAlert,
  useIonViewWillEnter,
  IonButtons,
} from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import { getFolders, getMusic, postFolder, putMusic } from "../services/api";

const SelectFolder = ({ history }) => {
  const { musicId } = useParams();
  const [music, setMusic] = useState(null);
  const [folders, setFolders] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  useIonViewWillEnter(async () => {
    const data = await getFolders(getAccessTokenSilently);
    setFolders(data);
  });
  useIonViewWillEnter(async () => {
    const data = await getMusic(musicId, getAccessTokenSilently);
    setMusic(data);
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar class="color">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>フォルダの選択</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonListHeader lines="full">
            <IonLabel>{music?.name}</IonLabel>
          </IonListHeader>
          <IonItem
            color="light"
            detail="false"
            target="_blank"
            class="item md item-lines-full in-list ion-activatable ion-focusable item-label hydrated"
            onClick={() => {
              setShowAlert(true);
            }}
          >
            <IonLabel>新規フォルダ</IonLabel>
          </IonItem>
          <div>
            {folders.map((d) => {
              if (music && d.id === music.folderId) {
                return (
                  <IonItem
                    key={d.id}
                    class="item md item-lines-full in-list ion-activatable ion-focusable item-label hydrated"
                  >
                    <IonLabel>{d.name}</IonLabel>
                  </IonItem>
                );
              } else {
                return (
                  <IonItem
                    key={d.id}
                    class="item md item-lines-full in-list ion-activatable ion-focusable item-label hydrated"
                    onClick={async () => {
                      await putMusic(
                        musicId,
                        {
                          folderId: d.id,
                        },
                        getAccessTokenSilently,
                      );
                      history.push(`/folder/${d.id}`);
                    }}
                  >
                    <IonLabel>{d.name}</IonLabel>
                  </IonItem>
                );
              }
            })}
          </div>
        </IonList>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass="my-custom-class"
          header="新規フォルダ"
          subHeader="フォルダの名前を記入してください"
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
            },
            {
              text: "Ok",
              handler: async ({ name }) => {
                await postFolder(
                  {
                    name,
                  },
                  getAccessTokenSilently,
                );
                const folders = await getFolders(getAccessTokenSilently);
                setFolders(folders);
              },
            },
          ]}
        />
      </IonContent>
      <IonFooter></IonFooter>
    </IonPage>
  );
};

export default SelectFolder;
