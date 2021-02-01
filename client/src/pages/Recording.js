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
  IonInput,
  IonTextarea,
  IonFooter,
  IonAlert,
  useIonViewWillEnter,
  IonGrid,
  IonCol,
  IonRow,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { closeOutline, radioButtonOnOutline } from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { musicRecord, saveAudio } from "../services/recording";
import { getFolder, postMusic, putMusicContent } from "../services/api";

const Recording = ({ history }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const folderId = params.get("folderId") || "";
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [folder, setFolder] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const [selected, setSelected] = useState();

  useIonViewWillEnter(async () => {
    if (folderId) {
      const data = await getFolder(folderId, getAccessTokenSilently);
      setFolder(data);
    }
  });

  console.log(comment);

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
            <IonLabel>自己評価</IonLabel>
            <IonSelect
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
                  const blob = saveAudio();
                  const record = { name };
                  if (folderId) {
                    record.folderId = folderId;
                  }
                  if (comment !== "") {
                    record.comment = comment;
                  }
                  const music = await postMusic(blob, getAccessTokenSilently);
                  console.log(music, music.id);
                  console.log(selected);
                  await putMusicContent(
                    music.id,
                    record,
                    getAccessTokenSilently
                  );
                  /*if (folderId) {
                    history.replace(`/folder/${folderId}`);
                  } else {
                    history.replace("/musics");
                  }*/
                },
              },
            ]}
          />

          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton expand="full">やり直す</IonButton>
              </IonCol>
              <IonCol>
                <IonButton expand="full" disabled="true">
                  記録する
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
