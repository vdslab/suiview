import React, { useEffect, useState } from "react";
import {
  IonHeader,
  IonItem,
  IonList,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButton,
  IonAlert,
  IonCard,
  IonIcon,
  IonInput,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonBackButton,
  useIonViewWillEnter,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonFooter,
  IonListHeader,
} from "@ionic/react";
import {
  chevronForwardOutline,
  trashOutline,
  chevronBackOutline,
  micOutline,
} from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import {
  request_music_list,
  request_del_music,
  request_folder_name,
} from "../serviceWorker/index";
import { useParams } from "react-router-dom";
import ProgressChart from "../chart/page/progress";
import ParallelChart from "../chart/page/parallel";
import FrequencyChart from "../chart/page/cmp_freq";
import VolumeChart from "../chart/page/comp_vol";
import ToneChart from "../chart/page/cmp_tone";

export const convertDate = (input) => {
  if (input === null) {
    return "";
  }

  const d = new Date(`${input} UTC`);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const date = `${d.getDate()}`.padStart(2, "0");
  const hour = `${d.getHours()}`.padStart(2, "0");
  const minute = `${d.getMinutes()}`.padStart(2, "0");
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
  const [chartId, setChartId] = useState("PITCH");
  const chartIds = ["PROGRESS", "ALL", "PITCH", "VOL", "TONE"];
  const { foldername } = useParams();
  console.log(foldername);
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
      {chartId === "PROGRESS" ? ShowChart(foldername, "progress") : []}
      {chartId === "ALL" ? ShowChart(foldername, "parallel") : []}
      {chartId === "PITCH" ? ShowChart(foldername, "pitch") : []}
      {chartId === "VOL" ? ShowChart(foldername, "vol") : []}
      {chartId === "TONE" ? ShowChart(foldername, "tone") : []}
    </div>
  );
};

const Folder = ({ history }) => {
  const [musics, setMusics] = useState();
  const id = useParams().foldername;
  const [folName, setFolName] = useState();

  const { getAccessTokenSilently } = useAuth0();

  useIonViewWillEnter(() => {
    request_music_list(id, getAccessTokenSilently).then((data) => {
      setMusics(data);
    });
  }, []);

  useIonViewWillEnter(() => {
    request_folder_name(id, getAccessTokenSilently).then((data) => {
      setFolName(data);
    });
  }, []);

  const delMusic = (id) => {
    request_del_music(id, getAccessTokenSilently).then((data) => {
      setMusics(data);
    });
  };

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
          <IonTitle>{folName}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {id == "all" ? (
          []
        ) : (
          <IonList>
            <IonCard>
              <FolderDetail />
            </IonCard>
          </IonList>
        )}
        <IonList>
          {musics !== undefined
            ? musics.map((data, i) => {
                return (
                  <IonItemSliding key={i}>
                    <IonItem
                      _ngcontent-yfv-c79=""
                      onClick={() => {
                        console.log(data);
                        history.push(`/detail/${data.id}/from/${id}`);
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
                            `/select_folder/${data.id}/folder/${id}/from/folderdata`
                          );
                        }}
                      >
                        file
                      </IonItemOption>

                      <IonItemOption
                        color="danger"
                        expandable
                        onClick={() => {
                          delMusic(data.id);
                        }}
                      >
                        delete
                      </IonItemOption>
                    </IonItemOptions>
                  </IonItemSliding>
                );
              })
            : []}
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButton
            slot="end"
            fill="clear"
            onClick={() => history.push(`/recording/${id}`)}
          >
            <IonIcon icon={micOutline}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Folder;
