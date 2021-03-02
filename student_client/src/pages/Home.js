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
import argImg from "../images/arpeggio.PNG";
import longtoneImg from "../images/longtone.PNG";
import scaleImg from "../images/scale.PNG";
import noImage from "../images/no_image.PNG";
export const defoFolder = [
  { img: longtoneImg, name: "ロングトーン" },
  { img: scaleImg, name: "スケール" },
  { img: argImg, name: "アルペジオ" },
];

const Home = () => {
  const [folders, setFolders] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  useIonViewWillEnter(async () => {
    const data = await getFolders(getAccessTokenSilently);
    setFolders(data);
  });
  console.log("hello!");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="start" fill="clear" routerLink="/setting">
            <IonIcon icon={settingsOutline}></IonIcon>
          </IonButton>
          <IonTitle>吹view</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem
            _ngcontent-yfv-c79=""
            routerLink="/musics"
            detail="false"
            class="item md item-lines-full in-list ion-activatable ion-focusable item-label hydrated"
          >
            <img src={noImage} alt="譜面の画像" className="score"></img>
            すべて
            <IonButton slot="end" fill="clear">
              <IonIcon icon={chevronForwardOutline}></IonIcon>
            </IonButton>
          </IonItem>

          {folders.map((data) => {
            let defo = 0;
            return (
              <IonItemSliding key={data.id}>
                <IonItem
                  detail="false"
                  routerLink={`/folder/${data.id}`}
                  class="item md item-lines-full in-list ion-activatable ion-focusable item-label hydrated"
                >
                  {defoFolder.map((d, k) => {
                    if (data.name === d.name) {
                      defo = 1;
                      return (
                        <img
                          src={d.img}
                          alt="譜面の画像"
                          key={k}
                          className="score"
                        ></img>
                      );
                    } else {
                      return <div key={k}></div>;
                    }
                  })}
                  {defo === 0 ? (
                    <img src={noImage} alt="譜面の画像" className="score"></img>
                  ) : (
                    []
                  )}
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
              text: "OK",
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
