import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonBackButton,
  IonButton,
  IonInput,
  IonCard,
  IonList,
  IonSelect,
  IonSelectOption,
  IonIcon,
  useIonViewWillEnter,
  IonActionSheet,
  IonListHeader,
  IonFooter,
} from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  closeOutline,
  ellipsisHorizontalCircleOutline,
  trash,
  close,
} from "ionicons/icons";
import {
  getMusic,
  getMusicComments,
  putMusic,
  deleteMusic,
} from "../services/api";
import { CentroidRolloff, Decibel, ShowFrequency } from "../components/chart";
import { Player } from "../components/Player.js";

const chartIds = ["PITCH", "VOL", "TONE"];

const Charts = () => {
  const { musicId } = useParams();
  const [chartId, setChartId] = useState(chartIds[0]);

  return (
    <div>
      <IonItem lines="none">
        <IonSelect
          value={chartId}
          placeholder={chartId}
          onIonChange={(e) => setChartId(e.detail.value)}
          buttons={["Cancel", "Open Modal", "Delete"]}
        >
          {chartIds.map((id, k) => {
            return (
              <IonSelectOption value={id} key={k}>
                {id}
              </IonSelectOption>
            );
          })}
        </IonSelect>
      </IonItem>
      {chartId === "PITCH" && (
        <div>
          <ShowFrequency musicId={musicId} />
        </div>
      )}
      {chartId === "VOL" && (
        <div>
          <Decibel musicId={musicId} />
        </div>
      )}
      {chartId === "TONE" && (
        <div>
          <CentroidRolloff musicId={musicId} />
        </div>
      )}
    </div>
  );
};

const Detail = ({ history }) => {
  const { musicId } = useParams();
  const [music, setMusic] = useState(null);
  const [comments, setComments] = useState([]);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  useIonViewWillEnter(async () => {
    const data = await getMusic(musicId, getAccessTokenSilently);
    setMusic(data);
  });
  useIonViewWillEnter(async () => {
    const data = await getMusicComments(musicId, getAccessTokenSilently);
    setComments(data);
  });

  console.log(comments);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonBackButton
            slot="start"
            fill="clear"
            defaultHref={
              music?.folderId ? `/folder/${music.folderId}` : "/musics"
            }
            icon={closeOutline}
          ></IonBackButton>

          <IonTitle>
            <IonItem lines="none">
              <IonInput
                value={music?.name}
                onIonChange={(e) => {
                  if (music) {
                    setMusic(Object.assign(music, { name: e.detail.value }));
                  }
                }}
              ></IonInput>
              <IonButton
                slot="end"
                fill="outline"
                onClick={() => {
                  putMusic(musicId, music, getAccessTokenSilently);
                }}
              >
                名前を変更する
              </IonButton>
            </IonItem>
          </IonTitle>
          <IonButton
            slot="end"
            fill="clear"
            onClick={() => {
              setShowActionSheet(true);
            }}
          >
            <IonIcon icon={ellipsisHorizontalCircleOutline}></IonIcon>
          </IonButton>
        </IonToolbar>

        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          cssClass="my-custom-class"
          buttons={[
            {
              text: "削除",
              role: "destructive",
              icon: trash,
              handler: async () => {
                await deleteMusic(music.id, getAccessTokenSilently);
                history.push("/");
              },
            },
            {
              text: "フォルダの移動",
              icon: ellipsisHorizontalCircleOutline,
              handler: () => {
                history.push(`/select_folder/${musicId}`);
                console.log("Share clicked");
              },
            },

            {
              text: "Cancel",
              icon: close,
              role: "cancel",
              handler: () => {
                console.log("Cancel clicked");
              },
            },
          ]}
        ></IonActionSheet>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonCard>
            <Charts />
          </IonCard>
        </IonList>
        <IonList>
          <IonListHeader>コメント</IonListHeader>
        </IonList>
      </IonContent>

      <IonFooter>
        {/*デザイン微妙*/}
        <IonToolbar>
          <IonList>
            <IonItem>
              <Player musicId={musicId} />
            </IonItem>
            <IonButton fill="outline">コメントを書く</IonButton>
          </IonList>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Detail;
