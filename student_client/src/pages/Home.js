import { useState } from "react";
import {
  IonHeader,
  IonItem,
  IonList,
  IonToolbar,
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
  caretDownOutline,
} from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { getFolders, deleteFolder, postFolder } from "../services/api";
import argImg from "../images/arpeggio.PNG";
import longtoneImg from "../images/longtone.PNG";
import scaleImg from "../images/scale.PNG";
import noImage from "../images/gray.png";
import Guide from "./Guide.js";
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

  function logined() {
    if ("visited" in localStorage) {
      return true;
    } else {
      return false;
    }
  }

  if (logined() === false) {
    return <Guide modal={true} />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="color">
          <IonButton
            color="primary"
            slot="start"
            fill="clear"
            routerLink="/setting"
          >
            <IonIcon icon={settingsOutline}></IonIcon>
          </IonButton>
          <h2>吹view<span style={{fontSize:"1.15rem"}}> -β版-</span></h2>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem lines="none"><IonIcon icon={caretDownOutline} color="medium"/>&ensp;練習フォルダを選択しましょう</IonItem>
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
                    削除
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            );
          })}
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar className="color">
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
              text: "取り消し",
              role: "cancel",
              cssClass: "secondary",
              handler: () => {
                console.log("Confirm Cancel");
              },
            },
            {
              text: "完了",
              handler: async ({ name }) => {
                if (name === "") {
                  alert("フォルダ名を入力してください");
                } else {
                  await postFolder({ name }, getAccessTokenSilently);
                  const data = await getFolders(getAccessTokenSilently);
                  setFolders(data);
                }
              },
            },
          ]}
        />
      </IonFooter>
    </IonPage>
  );
};

export default Home;
