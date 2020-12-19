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
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonBackButton,
  useIonViewWillEnter,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonFooter,
} from "@ionic/react";
import {
  chevronForwardOutline,
  chevronBackOutline,
  micOutline,
} from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import {
  deleteMusic,
  getFolder,
  getFolderMusics,
  getMusics,
} from "../services/api";
import {
  FrequencyChart,
  ParallelChart,
  ProgressChart,
  ToneChart,
  VolumeChart,
} from "../components/chart";

export const convertDate = (input) => {
  if (input === null) {
    return "";
  }
  //console.log("input = " + input);
  //const d = new Date(`${input} UTC`);
  const d = new Date(input);
  //console.log(d);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const date = `${d.getDate()}`.padStart(2, "0");
  /* const createdDay =
      year + "/" + month + "/" + date + "/" + hour + ":" + minute;*/
  const createdDay = year + "/" + month + "/" + date + "/";
  return createdDay;
};

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
  const [chartId, setChartId] = useState(chartIds[3]);
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

async function fetchMusics(folderId, getAccessToken) {
  if (folderId === "all") {
    return await getMusics(getAccessToken);
  } else {
    return await getFolderMusics(folderId, getAccessToken);
  }
}

const Folder = ({ history }) => {
  const { folderId } = useParams();
  const [musics, setMusics] = useState([]);
  const [folder, setFolder] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useIonViewWillEnter(async () => {
    const data = await fetchMusics(folderId, getAccessTokenSilently);
    setMusics(data);
  });

  useIonViewWillEnter(async () => {
    if (folderId !== "all") {
      const data = await getFolder(folderId, getAccessTokenSilently);
      setFolder(data);
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonBackButton
            slot="start"
            fill="clear"
            defaultHref="/"
            icon={chevronBackOutline}
          ></IonBackButton>
          <IonTitle>{folder?.name || "all"}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {folderId === "all" ? (
          []
        ) : (
          <IonList>
            <IonCard>
              <FolderDetail />
            </IonCard>
          </IonList>
        )}
        <IonList>
          {musics.map((data) => {
            return (
              <IonItemSliding key={data.id}>
                <IonItem
                  _ngcontent-yfv-c79=""
                  onClick={() => {
                    console.log(data);
                    history.push(`/detail/${data.id}/from/${folderId}`);
                  }}
                  detail="false"
                  target="_blank"
                  class="item md item-lines-full in-list ion-activatable ion-focusable item-label hydrated"
                >
                  <IonLabel>
                    No.{data.id}&emsp;{convertDate(data.created)}&emsp;
                    {data.name}&emsp;
                  </IonLabel>
                  <IonButton slot="end" fill="clear">
                    <IonIcon icon={chevronForwardOutline}></IonIcon>
                  </IonButton>
                </IonItem>

                <IonItemOptions>
                  <IonItemOption
                    color="primary"
                    expandable
                    onClick={() => {
                      history.push(
                        `/select_folder/${data.id}/folder/${folderId}/from/folderdata`,
                      );
                    }}
                  >
                    file
                  </IonItemOption>

                  <IonItemOption
                    color="danger"
                    expandable
                    onClick={async () => {
                      await deleteMusic(data.id, getAccessTokenSilently);
                      const musics = await fetchMusics(
                        folderId,
                        getAccessTokenSilently,
                      );
                      setMusics(musics);
                    }}
                  >
                    delete
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            );
          })}
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButton
            slot="end"
            fill="clear"
            onClick={() => history.push(`/recording/${folderId}`)}
          >
            <IonIcon icon={micOutline}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Folder;
