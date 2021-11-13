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
import { useTranslation } from "react-i18next";

const Charts = () => {
  const { t } = useTranslation();
  const chartIds = [t("pitch"), t("intensity"), t("timber")];
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
      {chartId === t("pitch") && (
        <div>
          <ShowFrequency musicId={musicId} />
        </div>
      )}
      {chartId === t("intensity") && (
        <div>
          <Decibel musicId={musicId} />
        </div>
      )}
      {chartId === t("timber") && (
        <div>
          <CentroidRolloff musicId={musicId} />
        </div>
      )}
    </div>
  );
};

const Detail = ({ history }) => {
  const { t } = useTranslation();
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

  //ナニコレ？
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
          <IonTitle>{t("detail")}</IonTitle>
        </IonToolbar>

        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          cssClass="my-custom-class"
          buttons={[
            {
              text: t("delete"),
              role: "destructive",
              icon: trash,
              handler: async () => {
                await deleteMusic(music.id, getAccessTokenSilently);
                history.push("/");
              },
            },
            {
              text: t("moveFolder"),
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
                <span> ★ {t("none")} </span>
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
              {t("overallScore")}：<span>{stability?.total}</span>
              &ensp;/300&ensp;
            </p>
            <p>
              {t("pitch")}：{stability?.f0}&emsp;{t("intensity")}：
              {stability?.vol}
              &emsp;{t("timber")}：{stability?.tone}
            </p>
          </div>
        </IonCard>
        <IonCard style={{ height: "350px" }}>
          <Charts />
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{t("comments")}</IonCardTitle>
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
                  {t("noComment")}
                  <br />
                  {t("letWriteComment")}&ensp;
                  <IonIcon icon={createOutline} />
                  &ensp;{t("writeFromBottomRight")}
                </p>
              </div>
            )}
          </IonList>
        </IonCard>
        <IonActionSheet
          isOpen={showActionSheet2}
          onDidDismiss={() => setShowActionSheet2(false)}
          cssClass="my-custom-class"
          header={t("changeSelfAssessment")}
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
              text: t("cancel"),
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
          header={t("comment")}
          subHeader={t("writeComment")}
          inputs={[
            {
              name: "item",
              type: "textarea",
            },
          ]}
          buttons={[
            {
              text: t("cancel"),
              role: "cancel",
              cssClass: "secondary",
              handler: () => {
                console.log("Confirm Cancel");
              },
            },
            {
              text: t("ok"),
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
