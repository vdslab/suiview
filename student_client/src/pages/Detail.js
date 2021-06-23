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
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  ellipsisHorizontalCircleOutline,
  trash,
  close,
  createOutline,
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
const chartIds = ["高さ", "強さ", "音色"];

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
      {chartId === "高さ" && (
        <div>
          <ShowFrequency musicId={musicId} />
        </div>
      )}
      {chartId === "強さ" && (
        <div>
          <Decibel musicId={musicId} />
        </div>
      )}
      {chartId === "音色" && (
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
  const [preName, setPreName] = useState();

  useIonViewWillEnter(async () => {
    const data = await getMusic(musicId, getAccessTokenSilently);
    setMusic(data);
    setPreName(data.name);
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
    if (preName !== music.name) {
      putMusic(musicId, music, getAccessTokenSilently);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="color">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref={
                music?.folderId ? `/folder/${music.folderId}` : "/musics"
              }
            />
          </IonButtons>
          <IonTitle>曲詳細</IonTitle>
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
          <IonCardHeader style={{ paddingTop: "8px", paddingBottom: "0px" }}>
            <IonCardTitle>
              <IonGrid className="ion-no-padding">
                <IonRow className="ion-no-padding">
                  <IonCol size="2" style={{ marginLeft: "-0.75rem" }}>
                    <Player musicId={musicId} />
                  </IonCol>
                  <IonCol style={{ paddingTop: "10px", paddingLeft: "10px" }}>
                    <IonInput
                      debounce="1500"
                      value={convertDate(music?.name)}
                      onIonChange={(e) => {
                        if (music) {
                          console.log("changed");
                          setMusic(
                            Object.assign(music, { name: e.detail.value })
                          );
                          changeName();
                        }
                      }}
                    ></IonInput>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardTitle>
          </IonCardHeader>
          <div style={{ textAlign: "center" }}>
            {music?.assessment === 0 ? (
              <IonButton
                fill="clear"
                size="large"
                onClick={() => setShowActionSheet2(true)}
              >
                <span> ★ なし </span>
              </IonButton>
            ) : (
              <IonButton
                fill="clear"
                size="large"
                onClick={() => setShowActionSheet2(true)}
              >
                <span> ★ {music?.assessment}</span>
              </IonButton>
            )}
            <p>
              総合点：<span>{stability?.total}</span>&ensp;/300&ensp;
            </p>
            <p>
              高さ：{stability?.f0}&emsp;強さ：{stability?.vol}&emsp;音色：
              {stability?.tone}
            </p>
          </div>
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
              text: "取り消し",
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
              text: "取り消し",
              role: "cancel",
              cssClass: "secondary",
              handler: () => {
                console.log("Confirm Cancel");
              },
            },
            {
              text: "完了",
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
        <IonToolbar className="color">
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
