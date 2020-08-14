import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonBackButton,
  IonButtons,
  IonButton,
  IonInput,
  IonCard,
  IonList,
  IonLabel,
  IonListHeader,
  IonSelect,
  IonSelectOption,
  IonItemDivider,
  IonIcon,
} from "@ionic/react";
import { add, chevronForwardOutline } from "ionicons/icons";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveParallelCoordinates } from "@nivo/parallel-coordinates";

//import convertDate from "../root/index";

const convertDate = (input) => {
  if (input === null) {
    return "";
  }

  const d = new Date(`${input} UTC`);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const date = `${d.getDate()}`.padStart(2, "0");
  const hour = `${d.getHours()}`.padStart(2, "0");
  const minute = `${d.getMinutes()}`.padStart(2, "0");
  const createdDay =
    year + "/" + month + "/" + date + "/" + hour + ":" + minute;
  return createdDay;
};

const FrequencyChart = ({ data }) => {
  if (data == null) {
    return null;
  }

  /*const Data = data.map((input) => {
    input.data.filter((x) => x % 5 == 0);
  });*/
  data.map((input) => {
    input.data.filter((x) => x % 5 == 0);
  });
  //console.log(data);
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveLine
        data={data.map((input) => {
          return {
            id: input.id,
            data: input.data.filter(({ x }) => x % 5 == 0),
          };
        })}
        /*data={[
          {
            //id: "x",
            data: data.filter(({ x }) => x % 5 === 0),
            //data: data.filter(({ x }) => x),
          },
        ]}*/
        //data={data}
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
        }}
        curve="step"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          tickValues: data.length
            ? data[0].data.filter(({ x }) => x % 500 === 0).map(({ x }) => x)
            : [],
          legend: "",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        colors={{ scheme: "category10" }}
        enablePoints={false}
        legends={[
          {
            anchor: "top-left",
            direction: "column",
            justify: false,
            translateX: 0,
            translateY: -50,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

const ParallelCoodinates = ({ data }) => {
  if (data == null) {
    return null;
  }

  /*data.map((input) => {
    input.data.filter((x) => x % 5 == 0);
  });*/
  const max = Math.max.apply(
    Math,
    data.map((input) => {
      return input.tone;
    })
  );
  const min = Math.min.apply(
    Math,
    data.map((input) => {
      return input.tone;
    })
  );

  const pich_max = Math.max.apply(
    Math,
    data.map((input) => {
      return input.pich;
    })
  );

  const vol_max = Math.max.apply(
    Math,
    data.map((input) => {
      return input.volume;
    })
  );

  const pich_vol_max = Math.max(pich_max, vol_max);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveParallelCoordinates
        data={data}
        variables={[
          {
            key: "No.",
            type: "point",
            min: "auto",
            max: "auto",
            ticksPosition: "before",
            legend: "No.",
            legendPosition: "start",
            legendOffset: 20,
          },
          {
            key: "pich",
            type: "linear",
            min: 0,
            max: "auto",
            ticksPosition: "before",
            legend: "pich",
            legendPosition: "start",
            legendOffset: 20,
          },
          {
            key: "tone",
            type: "linear",
            min: max,
            max: min,
            ticksPosition: "before",
            legend: "tone",
            legendPosition: "start",
            legendOffset: 20,
          },
          {
            key: "volume",
            type: "linear",
            padding: 1,
            min: 0,
            max: "auto",
            ticksPosition: "before",
            legend: "volume",
            legendPosition: "start",
            legendOffset: 20,
          },
        ]}
        axesPlan="foreground"
        strokeWidth={3}
        //lineOpacity={0.1}
        margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
        animate={true}
        motionStiffness={90}
        motionDamping={12}
        colors={{ scheme: "category10" }}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: "rgb(136, 158, 174)",
                strokeWidth: 2,
              },
            },
            ticks: {
              line: {
                stroke: "rgb(136, 158, 174)",
                strokeWidth: 2,
              },
            },
          },
        }}
      />
    </div>
  );
};

const Folder = () => {
  const { folderId } = useParams();
  const [foldersData, setFoldersData] = useState([]);
  const [musics, setMusics] = useState([]);
  const [folderName, setFolderName] = useState();
  const [parallelData, setPallelData] = useState();

  let chart = "nomal";
  console.log(chart);

  useEffect(() => {
    window
      .fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/1/musics/folders/${folderId}`
      )
      .then((response) => response.json())
      .then((folderName) => {
        setFolderName(folderName);
      });
  }, []);

  useEffect(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics/folders`)
      .then((response) => response.json())
      .then((foldersData) => {
        setFoldersData(foldersData);
      });
  }, []);

  useEffect(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics`)
      .then((response) => response.json())
      .then((musics) => {
        setMusics(musics);
      });
  }, []);

  useEffect(() => {
    window
      .fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/1/musics/parallel/${folderId}`
      )
      .then((response) => response.json())
      .then((parallelData) => {
        setPallelData(parallelData);
      });
  }, []);

  const folder_ids = foldersData.filter((input) => input.folder_id == folderId);
  const music_ids = Array.from(
    new Set(
      folder_ids.map((input) => {
        return input.music_id;
      })
    )
  );
  //console.log(foldersData);

  console.log(music_ids);
  const musicData = musics.filter((input) => {
    for (let i = 0; i < music_ids.length; i++) {
      if (input.id == music_ids[i]) {
        return input;
      }
    }
  });
  //console.log(musicData);

  /*const [data, setData] = useState();
  useEffect(() => {
    window
      .fetch(
        ` ${process.env.REACT_APP_API_ENDPOINT}/1/musics/folder_freq_compare/${folderId}`
      )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);*/

  //console.log(data);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>
            Folder{folderId} {folderName}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          {musicData.map(({ created, id, name }) => {
            return (
              <IonCard>
                <IonItem>
                  play
                  <audio
                    controls
                    src={`${process.env.REACT_APP_API_ENDPOINT}/1/musics/${id}/content`}
                  />
                </IonItem>
                <IonItem>
                  No.{id}:{name} &emsp;{convertDate(created)}
                  <IonButton
                    slot="end"
                    fill="clear"
                    key={id}
                    routerLink={`/detail/${id}`}
                  >
                    <IonIcon icon={chevronForwardOutline} color="primary" />
                  </IonButton>
                </IonItem>
              </IonCard>
            );
          })}
        </IonList>
        <IonList>
          <IonButton
            onClick={() => {
              chart = "nomal";
              console.log(chart);
            }}
          >
            nomal
          </IonButton>
          <IonButton
            onClick={() => {
              chart = "pich";
              console.log(chart);
            }}
          >
            pich
          </IonButton>
          <IonButton
            onClick={() => {
              chart = "tone";
              console.log(chart);
            }}
          >
            tone
          </IonButton>
          <IonButton
            onClick={() => {
              chart = "volume";
              console.log(chart);
            }}
          >
            volume
          </IonButton>
          <IonItem>
            {chart == "nomal" ? (
              <ParallelCoodinates data={parallelData}></ParallelCoodinates>
            ) : (
              <IonItem>hello</IonItem>
            )}
            {/*} <ParallelCoodinates data={parallelData}></ParallelCoodinates>*/}
          </IonItem>
          {/*} <IonItem>{<FrequencyChart data={data} />}</IonItem>*/}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Folder;
