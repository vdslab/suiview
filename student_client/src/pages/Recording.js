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
} from "@ionic/react";
import { closeOutline, radioButtonOnOutline } from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { musicRecord, saveAudio } from "../services/recording";
import {
  getFolder,
  postMusic,
  putMusicContent,
  deleteMusic,
} from "../services/api";
import { Player } from "../components/Player.js";
import { defoFolder } from "./Home.js";
import noImage from "../images/gray.png";

const Recording = ({ history }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const folderId = params.get("folderId") || "";
  const [comment, setComment] = useState("");
  const [folder, setFolder] = useState(null);
  //const [allFolder, setAllFolder] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const [selected, setSelected] = useState(3);
  const [recorded, setRecorded] = useState(0);
  const [musicId, setMusicId] = useState();
  const imgData = defoFolder.find((v) => v.name === folder?.name);

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
          <IonBackButton slot="start" defaultHref="/" icon={closeOutline} />
          <IonTitle>記録する</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="color">
        <IonList style={{ backgroundColor: "#fffcf2" }}>
          {imgData ? (
            <img
              src={imgData.img}
              alt="譜面の画像"
              className=""
              style={{ maxWidth: "100%" }}
            ></img>
          ) : (
            <img
              src={noImage}
              alt="譜面の画像"
              className=""
              style={{ width: "100%" }}
            ></img>
          )}
          <IonListHeader lines="full">
            <IonTitle>{folder?.name || "フォルダ指定なし"}</IonTitle>
          </IonListHeader>
          <IonItem color="color">
            <IonLabel>自己評価</IonLabel>
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
            header={"録音中..."}
            buttons={[
              { text: "取り消し" },
              {
                text: "完了!",
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
                    console.log(recorded);
                  }}
                >
                  やり直す
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
                    console.log(musicId);
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
