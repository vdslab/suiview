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
  IonTitle,
  IonButtons,
  IonThumbnail,
  IonImg,
} from "@ionic/react";
import {
  settingsOutline,
  folderOutline,
  micOutline,
  caretDownOutline,
} from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { getFolders, deleteFolder, postFolder } from "../services/api";
import { folderImage } from "../services/folderImage";
import Guide from "./Guide";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
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
          <IonButtons slot="end">
            <IonButton routerLink="/setting">
              <IonIcon icon={settingsOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>{t("title")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem lines="none">
          <IonIcon icon={caretDownOutline} color="medium" />
          &ensp;{t("selectPracticeFolder")}
        </IonItem>
        <IonList>
          {/*<IonItem className="folder" routerLink="/musics" c>
            <IonThumbnail slot="start">
              <IonImg src={folderImage()} />
            </IonThumbnail>
            <IonLabel>すべて</IonLabel>
          </IonItem>*/}

          {folders.map((data) => {
            return (
              <IonItemSliding key={data.id}>
                <IonItem className="folder" routerLink={`/folder/${data.id}`}>
                  <IonThumbnail slot="start">
                    <IonImg src={folderImage(data.name)} />
                  </IonThumbnail>
                  <IonLabel>{data.name}</IonLabel>
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
                    {t("delete")}
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
          header={t("newFolder")}
          subHeader={t("enterFolderName")}
          inputs={[
            {
              name: "name",
              type: "text",
              placeholder: t("name"),
            },
          ]}
          buttons={[
            {
              text: t("cahcel"),
              role: "cancel",
              cssClass: "secondary",
              handler: () => {
                console.log("Confirm Cancel");
              },
            },
            {
              text: t("ok"),
              handler: async ({ name }) => {
                if (name === "") {
                  alert(t("enterFolderName"));
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
