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

const LinerChart = ({ data }) => {
  if (data == null) {
    return null;
  }

  data.map((input) => {
    input.data.filter((x) => x % 5 == 0);
  });

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveLine
        data={data.map((input) => {
          return {
            id: input.id,
            data: input.data.filter(({ x }) => x % 5 == 0),
          };
        })}
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

const FrequencyDraw = ({ folderId }) => {
  const [data, setData] = useState();
  useEffect(() => {
    window
      .fetch(
        ` ${process.env.REACT_APP_API_ENDPOINT}/1/musics/folder_freq_compare/${folderId}`
      )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);
  console.log(data);
  console.log(folderId);
  if (data == undefined) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <LinerChart data={data} />
    </div>
  );
};

const FrequencyChart = (folderId) => {
  if (folderId == null) {
    return null;
  }

  return (
    <div>
      <FrequencyDraw folderId={folderId} />
    </div>
  );
};

const ParallelCoordinates = ({ data }) => {
  if (data == null) {
    return null;
  }
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
            min: "auto",
            max: "auto",
            ticksPosition: "before",
            legend: "ptich",
            legendPosition: "start",
            legendOffset: 20,
          },
          {
            key: "tone",
            type: "linear",
            //min: max,
            //max: min,
            min: "auto",
            max: "auto",
            ticksPosition: "before",
            legend: "tone",
            legendPosition: "start",
            legendOffset: 20,
          },
          {
            key: "volume",
            type: "linear",
            padding: 1,
            min: "auto",
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
        colors={{ scheme: "yellow_green" }}
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

const ParalellDraw = ({ folderId }) => {
  const [data, setData] = useState();
  useEffect(() => {
    window
      .fetch(
        ` ${process.env.REACT_APP_API_ENDPOINT}/1/musics/parallel/${folderId}`
      )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  if (data == undefined) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <ParallelCoordinates data={data} />
    </div>
  );
};

const ParallelChart = (folderId) => {
  if (folderId == null) {
    return null;
  }

  return (
    <div>
      <ParalellDraw folderId={folderId} />
    </div>
  );
};

const ToneDraw = ({ folderId }) => {
  const [data, setData] = useState();
  useEffect(() => {
    window
      .fetch(
        ` ${process.env.REACT_APP_API_ENDPOINT}/1/musics/folder_comp_tone/${folderId}`
      )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  if (data == undefined) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <LinerChart data={data} />
    </div>
  );
};

const ToneChart = (folderId) => {
  if (folderId == null) {
    return null;
  }

  return (
    <div>
      <ToneDraw folderId={folderId} />
    </div>
  );
};

const VolumeDraw = ({ folderId }) => {
  const [data, setData] = useState();
  useEffect(() => {
    window
      .fetch(
        ` ${process.env.REACT_APP_API_ENDPOINT}/1/musics/folder_comp_volume/${folderId}`
      )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  if (data == undefined) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <LinerChart data={data} />
    </div>
  );
};

const VolumeChart = (folderId) => {
  if (folderId == null) {
    return null;
  }

  return (
    <div>
      <VolumeDraw folderId={folderId} />
    </div>
  );
};

const FolderDetail = () => {
  const [chartId, setChartId] = useState("ALL");
  const chartIds = ["All", "PITCH", "VOL", "TONE"];
  const { folderId } = useParams();
  console.log(chartId);
  return (
    <div>
      <IonSelect
        value={chartId}
        placeholder={chartId}
        onIonChange={(e) => setChartId(e.detail.value)}
        buttons={["Cancel", "Open Modal", "Delete"]}
      >
        {chartIds.map((id) => {
          return <IonSelectOption value={id}>{id}</IonSelectOption>;
        })}
      </IonSelect>
      {chartId === "ALL" ? ParallelChart(folderId) : []}
      {chartId === "PITCH" ? FrequencyChart(folderId) : []}
      {chartId === "VOL" ? VolumeChart(folderId) : []}
      {chartId === "TONE" ? ToneChart(folderId) : []}
    </div>
  );
};

export default FolderDetail;
