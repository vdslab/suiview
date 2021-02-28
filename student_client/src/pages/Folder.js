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
import { defoFolder } from "./Home.js";
import noImage from "../images/no_image.PNG";
import { chevronBackOutline } from "ionicons/icons";

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
  } else if (kind === "vol") {
    return <VolumeChart folderId={folderId} />;
  } else if (kind === "tone") {
    return <ToneChart folderId={folderId} />;
  }
};

const FolderDetail = () => {
  const chartIds = ["PROGRESS", "ALL", "PITCH", "VOL", "TONE"];
  const [chartId, setChartId] = useState(chartIds[0]);
  const { folderId } = useParams();

  return (
    <div>
      <IonItem>
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
      {chartId === "PROGRESS" ? ShowChart(folderId, "progress") : []}
      {chartId === "ALL" ? ShowChart(folderId, "parallel") : []}
      {chartId === "PITCH" ? ShowChart(folderId, "pitch") : []}
      {chartId === "VOL" ? ShowChart(folderId, "vol") : []}
      {chartId === "TONE" ? ShowChart(folderId, "tone") : []}
    </div>
  );
};

const Folder = ({ history }) => {
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
  const imgData = defoFolder.find((v) => v.name === folder?.name);

  return (
    <IonPage>
      <IonHeader style={{ height: "8.5rem" }} class="--backgoundColor:red">
        <IonToolbar
          style={{
            height: "8.5rem",
          }}
        >
          {" "}
          <IonBackButton
            slot="start"
            fill="clear"
            defaultHref="/"
            style={{ marginTop: "-5rem" }}
            icon={chevronBackOutline}
          />
          <div style={{ height: "5rem" }}>
            {imgData ? (
              <img
                src={imgData.img}
                alt="譜面の画像"
                className=""
                style={{ maxWidth: "100%", marginLeft: "-2rem" }}
              ></img>
            ) : (
              <img
                src={noImage}
                alt="譜面の画像"
                className=""
                style={{ width: "100%", marginLeft: "-2rem" }}
              ></img>
            )}
          </div>
          <IonItem lines="none" style={{ marginLeft: "-2rem" }}>
            {folder?.name}
          </IonItem>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {musics.length === 0 ? (
          <IonCard style={{ height: "380px" }}>
            <IonCardContent style={{ marginTop: "35%", marginLeft: "15%" }}>
              <p>データがありません</p>
              <p>
                右下の&ensp;<IonIcon icon={micOutline}></IonIcon>&ensp;
                から録音しましょう
              </p>
            </IonCardContent>
          </IonCard>
        ) : (
          <IonCard style={{ height: "380px" }}>
            <FolderDetail />
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
        <IonToolbar>
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
