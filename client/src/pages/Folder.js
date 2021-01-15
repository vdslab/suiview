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
  IonCard,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonBackButton,
  useIonViewWillEnter,
  IonFooter,
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

////////////////////////////////////////////
const ShowChart = (folderId, kind) => {
  console.log("here");
  if (folderId == null) {
    return null;
  }
  console.log(kind);

  if (kind === "progress") {
    return (
      <div>
        <ProgressChart folderId={folderId} />
      </div>
    );
  } else if (kind === "parallel") {
    return (
      <div>
        <ParallelChart folderId={folderId} />
      </div>
    );
  } else if (kind === "pitch") {
    return (
      <div>
        <FrequencyChart folderId={folderId} />
      </div>
    );
  } else if (kind === "vol") {
    return (
      <div>
        <VolumeChart folderId={folderId} />
      </div>
    );
  } else if (kind === "tone") {
    return (
      <div>
        <ToneChart folderId={folderId} />
      </div>
    );
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonBackButton
            slot="start"
            fill="clear"
            defaultHref="/"
          ></IonBackButton>
          <IonTitle>{folder?.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonCard>
            <FolderDetail />
          </IonCard>
        </IonList>
        <IonList>
          {musics.map((data) => {
            return (
              <MusicItem
                key={data.id}
                music={data}
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
