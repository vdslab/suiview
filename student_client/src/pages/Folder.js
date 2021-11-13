import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  IonHeader,
  IonItem,
  IonList,
  IonToolbar,
  IonContent,
  IonPage,
  IonButton,
  IonCard,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonBackButton,
  useIonViewWillEnter,
  IonFooter,
  IonCardContent,
  IonButtons,
  IonTitle,
  IonImg,
} from "@ionic/react";
import { micOutline } from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { deleteMusic, getFolder, getFolderMusics } from "../services/api";
import {
  FrequencyChart,
  ParallelChart,
  ProgressChart,
  ToneChart,
  VolumeChart,
} from "../components/chart";
import MusicItem from "../components/MusicItem.js";
import { folderImage } from "../services/folderImage";
import { useTranslation } from "react-i18next";

////////////////////////////////////////////
const ShowChart = (folderId, kind) => {
  if (folderId == null) {
    return null;
  }

  if (kind === "progress") {
    return <ProgressChart folderId={folderId} />;
  } else if (kind === "parallel") {
    return <ParallelChart folderId={folderId} />;
  } else if (kind === "pitch") {
    return <FrequencyChart folderId={folderId} />;
  } else if (kind === "intensity") {
    return <VolumeChart folderId={folderId} />;
  } else if (kind === "timber") {
    return <ToneChart folderId={folderId} />;
  }
};

const FolderDetail = (item) => {
  const { t } = useTranslation();
  const chartIds = [t("stackedScore"), t("pitch"), t("intensity"), t("timber")];
  const chartIds2 = [
    t("overallScore"),
    t("stackedScore"),
    t("pitch"),
    t("intensity"),
    t("timber"),
  ];
  const { folderId } = useParams();
  const count = item.count;
  let IdSet = chartIds;
  if (count > 10) {
    IdSet = chartIds2;
  }
  const [chartId, setChartId] = useState(IdSet[0]);
  return (
    <div>
      <IonItem>
        <IonSelect
          value={chartId}
          placeholder={chartId}
          onIonChange={(e) => setChartId(e.detail.value)}
          buttons={["Cancel", "Open Modal", "Delete"]}
        >
          {IdSet.map((id, k) => {
            return (
              <IonSelectOption value={id} key={k}>
                {id}
              </IonSelectOption>
            );
          })}
        </IonSelect>
      </IonItem>
      {chartId === t("overallScore") ? ShowChart(folderId, "progress") : []}
      {chartId === t("stackedScore") ? ShowChart(folderId, "parallel") : []}
      {chartId === t("pitch") ? ShowChart(folderId, "pitch") : []}
      {chartId === t("intensity") ? ShowChart(folderId, "intensity") : []}
      {chartId === t("timber") ? ShowChart(folderId, "timber") : []}
    </div>
  );
};

const Folder = ({ history }) => {
  const { t } = useTranslation();
  const { folderId } = useParams();
  const [musics, setMusics] = useState([]);
  const [folder, setFolder] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useIonViewWillEnter(async () => {
    const data = await getFolderMusics(folderId, getAccessTokenSilently);
    setMusics(data);
  });

  useIonViewWillEnter(async () => {
    const data = await getFolder(folderId, getAccessTokenSilently);
    setFolder(data);
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="color">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>{folder?.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonImg src={folderImage(folder?.name)} alt={folder?.name} />
        {musics.length === 0 ? (
          <IonCard style={{ height: "380px" }}>
            <IonCardContent style={{ marginTop: "35%", marginLeft: "15%" }}>
              <p>{t("noData")}</p>
              <p>
                {t("letRecord")}&ensp;<IonIcon icon={micOutline}></IonIcon>
                &ensp; {t("addDataFromBottomRight")}
              </p>
            </IonCardContent>
          </IonCard>
        ) : (
          <IonCard style={{ height: "380px" }}>
            <FolderDetail count={musics.length} />
          </IonCard>
        )}
        <IonList>
          {musics.map((data, i) => {
            return (
              <MusicItem
                key={data.id}
                trackNum={i}
                music={data}
                no={true}
                routerLink={`/detail/${data.id}/from/${folderId}`}
                onClickMoveButton={() => {
                  history.push(`/select_folder/${data.id}`);
                }}
                onClickDeleteButton={async () => {
                  await deleteMusic(data.id, getAccessTokenSilently);
                  const musics = await getFolderMusics(
                    folderId,
                    getAccessTokenSilently
                  );
                  setMusics(musics);
                }}
              />
            );
          })}
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar className="color">
          <IonButton
            slot="end"
            fill="clear"
            routerLink={`/recording?folderId=${folderId}`}
          >
            <IonIcon icon={micOutline}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Folder;
