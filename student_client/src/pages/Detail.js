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
  IonFooter,
  IonAlert,
  IonItemDivider,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  closeOutline,
  ellipsisHorizontalCircleOutline,
  trash,
  close,
  createOutline,
} from "ionicons/icons";
import {
  getMusic,
  putMusicComment,
  getMusicComments,
  putMusic,
  deleteMusic,
  getMusicStability,
} from "../services/api";
import { CentroidRolloff, Decibel, ShowFrequency } from "../components/chart";
import { Player } from "../components/Player.js";
import { convertDate } from "../services/date.js";

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
  const [showAlert, setShowAlert] = useState(false);
  const [stability, steStability] = useState([]);

  const { getAccessTokenSilently } = useAuth0();

  useIonViewWillEnter(async () => {
    const data = await getMusic(musicId, getAccessTokenSilently);
    setMusic(data);
  });
  useIonViewWillEnter(async () => {
    const data = await getMusicComments(musicId, getAccessTokenSilently);
    setComments(data);
  });
  useIonViewWillEnter(async () => {
    const data = await getMusicStability(musicId, getAccessTokenSilently);
    steStability(data);
  });

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
        <IonCard>
          <IonGrid>
            <IonRow>
              <IonCol size="2">
                <Player musicId={musicId} />
              </IonCol>
              <IonCol>
                <IonItem lines="none">
                  総合点：{stability?.total}&emsp;
                  {music?.assessment === 0 ? (
                    <div> ★なし</div>
                  ) : (
                    <div> ★{music?.assessment}</div>
                  )}
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonItem className="ion-text-center">
            音程：{stability?.f0}&emsp;強さ：{stability?.vol}&emsp;音色：
            {stability?.tone}
          </IonItem>
        </IonCard>
        <IonCard style={{ height: "350px" }}>
          <Charts />
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>コメント</IonCardTitle>
          </IonCardHeader>
          <IonList>
            {comments.length !== 0 ? (
              comments.map((data) => {
                return (
                  <div>
                    <IonItem key={data.id} lines="none">
                      <IonItemDivider color="light">
                        <IonLabel>
                          {data.writer == null ? (
                            <div>{convertDate(data.created)} &ensp;</div>
                          ) : (
                            <div>
                              {convertDate(data.created)}&ensp;by {data.writer}
                            </div>
                          )}
                        </IonLabel>
                      </IonItemDivider>
                    </IonItem>
                    <IonItem>{data.comment}</IonItem>
                  </div>
                );
              })
            ) : (
              <IonItem lines="none">まだコメントはありません</IonItem>
            )}
          </IonList>
        </IonCard>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass="my-custom-class"
          header={"コメント"}
          subHeader={"コメントを記入してください"}
          inputs={[
            {
              name: "item",
              type: "textarea",
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
              handler: async ({ item }) => {
                const data = await putMusicComment(
                  musicId,
                  { item },
                  getAccessTokenSilently
                );
                setComments(data);
              },
            },
          ]}
        />
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButton
            size="large"
            slot="end"
            fill="clear"
            onClick={() => setShowAlert(true)}
          >
            <IonIcon icon={createOutline}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Detail;
