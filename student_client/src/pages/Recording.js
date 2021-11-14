import { useState } from "react";
import { useLocation } from "react-router-dom";
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
  IonTextarea,
  IonFooter,
  IonAlert,
  useIonViewWillEnter,
  IonGrid,
  IonCol,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonImg,
  IonButtons,
} from "@ionic/react";
import { radioButtonOnOutline } from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { musicRecord, saveAudio } from "../services/recording";
import {
  getFolder,
  postMusic,
  putMusicContent,
  deleteMusic,
} from "../services/api";
import { Player } from "../components/Player.js";
import { folderImage } from "../services/folderImage";
import { useTranslation } from "react-i18next";

const Recording = ({ history }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const folderId = params.get("folderId") || "";
  const [comment, setComment] = useState("");
  const [folder, setFolder] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const [selected, setSelected] = useState(3);
  const [recorded, setRecorded] = useState(0);
  const [musicId, setMusicId] = useState();

  useIonViewWillEnter(async () => {
    if (folderId) {
      const data = await getFolder(folderId, getAccessTokenSilently);
      setFolder(data);
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="color">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>{t("record")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="color">
        <IonList style={{ backgroundColor: "#fffcf2" }}>
          <IonImg src={folderImage(folder?.name)} alt={t("musicalScore")} />
          <IonListHeader lines="full">
            <IonTitle>{folder?.name || t("noFolderSpecified")}</IonTitle>
          </IonListHeader>
          <IonItem color="color">
            <IonLabel>{t("selfAssessment")}</IonLabel>
            <IonSelect
              value={selected}
              onIonChange={(e) => {
                setSelected(e.target.value);
              }}
            >
              <IonSelectOption value="5">5</IonSelectOption>
              <IonSelectOption value="4">4</IonSelectOption>
              <IonSelectOption value="3">3</IonSelectOption>
              <IonSelectOption value="2">2</IonSelectOption>
              <IonSelectOption value="1">1</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem color="color">
            <IonLabel>{t("comment")}</IonLabel>
            <IonTextarea
              placeholder=""
              value={comment}
              onIonChange={(e) => setComment(e.detail.value)}
            ></IonTextarea>
          </IonItem>
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar className="color">
          {recorded === 0 ? (
            <IonButton
              expand="full"
              onClick={() => {
                musicRecord();
                setShowAlert(true);
              }}
            >
              <IonIcon icon={radioButtonOnOutline}></IonIcon>
            </IonButton>
          ) : (
            <Player musicId={musicId} />
          )}
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            cssClass="my-custom-class"
            header={t("recording")}
            buttons={[
              { text: t("cancel") },
              {
                text: t("ok"),
                handler: async () => {
                  const blob = saveAudio();
                  const music = await postMusic(blob, getAccessTokenSilently);
                  setRecorded(1);
                  setMusicId(music.id);
                },
              },
            ]}
          />

          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton
                  expand="full"
                  disabled={(recorded + 1) % 2}
                  onClick={async () => {
                    await deleteMusic(musicId, getAccessTokenSilently);
                    setRecorded(0);
                    // console.log(recorded);
                  }}
                >
                  {t("tryAgain")}
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  expand="full"
                  disabled={(recorded + 1) % 2}
                  onClick={async () => {
                    //const item = { name };
                    const name = "";
                    const item = { name };
                    if (folderId) {
                      item.folderId = folderId;
                    }
                    if (comment !== "") {
                      item.comment = comment;
                    }
                    if (selected !== undefined) {
                      item.assessment = selected;
                    }
                    // console.log(musicId);
                    await putMusicContent(
                      musicId,
                      item,
                      getAccessTokenSilently
                    );
                    setRecorded(0);
                    if (folderId) {
                      history.replace(`/folder/${folderId}`);
                    } else {
                      history.replace("/musics");
                    }
                  }}
                >
                  {t("completed")}
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Recording;
