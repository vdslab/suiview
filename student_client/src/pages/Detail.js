import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
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
  ellipsisHorizontalCircleOutline,
  trash,
  close,
  createOutline,
  chevronBackOutline,
} from "ionicons/icons";
import {
  getMusic,
  putMusicComment,
  getMusicComments,
  deleteMusic,
  putMusic,
  getMusicStability,
  putMusicAssesment,
} from "../services/api";
import { CentroidRolloff, Decibel, ShowFrequency } from "../components/chart";
import { Player } from "../components/Player.js";
import { convertDate } from "../services/date.js";
import "./detail.css";
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
  const [showActionSheet2, setShowActionSheet2] = useState(false);
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

  async function changeAssesment(input) {
    const data = await putMusicAssesment(
      musicId,
      input,
      getAccessTokenSilently
    );
    setMusic(data);
  }

  function changeName() {
    putMusic(musicId, music, getAccessTokenSilently);
    history.replace(music?.folderId ? `/folder/${music.folderId}` : "/musics");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton
            fill="clear"
            onClick={() => {
              changeName();
            }}
          >
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonTitle>曲詳細</IonTitle>
          {/*}
            <IonBackButton
              slot="start"
              fill="clear"
              defaultHref={
                music?.folderId ? `/folder/${music.folderId}` : "/musics"
              }
              icon={chevronBackOutline}
            />
          </IonButtons>
          >*/}
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
          <IonCardHeader>
            <IonCardTitle>
              <IonGrid class="ion-no-padding">
                <IonRow class="ion-no-padding">
                  <IonCol size="2" style={{ marginLeft: "-0.75rem" }}>
                    <Player musicId={musicId} />
                  </IonCol>
                  <IonCol style={{ paddingTop: "10px", paddingLeft: "10px" }}>
                    <IonInput
                      value={convertDate(music?.name)}
                      onIonChange={(e) => {
                        if (music) {
                          setMusic(
                            Object.assign(music, { name: e.detail.value })
                          );
                        }
                      }}
                    ></IonInput>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardTitle>
          </IonCardHeader>

          <IonItem lines="none">
            総合点：<span>{stability?.total}</span>&ensp;/300&ensp;
            {music?.assessment === 0 ? (
              <div>
                <IonButton
                  fill="clear"
                  size="large"
                  onClick={() => setShowActionSheet2(true)}
                >
                  <span> ★ なし </span>
                </IonButton>
              </div>
            ) : (
              <div>
                <IonButton
                  fill="clear"
                  size="large"
                  onClick={() => setShowActionSheet2(true)}
                >
                  <span> ★ {music?.assessment}</span>
                </IonButton>
              </div>
            )}
          </IonItem>

          <IonItem className="ion-text-center ion-padding-bottom" lines="none">
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
              <div>
                <p className="comment_text">
                  まだコメントはありません。
                  <br />
                  右下の&ensp;
                  <IonIcon icon={createOutline} />
                  &ensp;からコメントを書きましょう。
                </p>
              </div>
            )}
          </IonList>
        </IonCard>
        <IonActionSheet
          isOpen={showActionSheet2}
          onDidDismiss={() => setShowActionSheet2(false)}
          cssClass="my-custom-class"
          header={"自己評価の変更"}
          buttons={[
            {
              text: "5",
              role: "5",
              cssClass: "secondary",
              handler: () => {
                changeAssesment(5);
                console.log("Confirm Cancel");
              },
            },
            {
              text: "4",
              role: "4",
              cssClass: "secondary",
              handler: () => {
                changeAssesment(4);
                console.log("Confirm Cancel");
              },
            },
            {
              text: "3",
              role: "3",
              cssClass: "secondary",
              handler: () => {
                changeAssesment(3);
                console.log("Confirm Cancel");
              },
            },
            {
              text: "2",
              role: "2",
              cssClass: "secondary",
              handler: () => {
                changeAssesment(2);
                console.log("Confirm Cancel");
              },
            },
            {
              text: "1",
              role: "1",
              cssClass: "secondary",
              handler: () => {
                changeAssesment(1);
                console.log("Confirm Cancel");
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
        />

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
