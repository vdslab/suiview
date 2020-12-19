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
  IonButton,
  IonIcon,
  IonLabel,
  IonListHeader,
  IonBackButton,
  IonInput,
  IonTextarea,
  IonFooter,
  IonAlert,
  useIonViewWillEnter,
} from "@ionic/react";
import { closeOutline, radioButtonOnOutline } from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { musicRecord, saveAudio } from "../services/recording";
import { getFolder, postMusic, putMusicContent } from "../services/api";

const Recording = ({ history }) => {
  const { folderId } = useParams();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [folder, setFolder] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  useIonViewWillEnter(async () => {
    if (folderId !== "all") {
      const data = await getFolder(folderId, getAccessTokenSilently);
      setFolder(data);
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonBackButton slot="start" defaultHref="/" icon={closeOutline} />
          <IonTitle>記録する</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonListHeader lines="full">
            フォルダ名 &emsp; {folder?.name || "all"}
          </IonListHeader>
          <IonItem>
            <IonLabel>名前&ensp;</IonLabel>
            <IonInput
              value={name}
              placeholder="music name"
              onIonChange={(e) => setName(e.detail.value)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>コメント</IonLabel>
            <IonTextarea
              placeholder=""
              value={comment}
              onIonChange={(e) => setComment(e.detail.value)}
            ></IonTextarea>
          </IonItem>
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButton
            expand="full"
            onClick={() => {
              musicRecord();
              setShowAlert(true);
            }}
          >
            <IonIcon icon={radioButtonOnOutline}></IonIcon>
          </IonButton>
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            cssClass="my-custom-class"
            header={"録音中..."}
            buttons={[
              { text: "取り消し" },
              {
                text: "完了!",
                handler: async () => {
                  console.log("push fin");
                  const blob = saveAudio();
                  const music = await postMusic(
                    {
                      name,
                    },
                    getAccessTokenSilently,
                  );
                  await putMusicContent(music.id, blob, getAccessTokenSilently);
                  history.push(`/detail/${music.id}/from/${folderId}`);
                },
              },
            ]}
          />

          {/*<IonGrid>
            <IonRow>
              <IonCol>
                <IonButton expand="full">やり直す</IonButton>
              </IonCol>
              <IonCol>
                <IonButton expand="full">記録する</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>*/}
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Recording;
