import React, { useEffect, useState, forwardRef } from "react";
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
  IonImg,
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
        {...console.log(data.length)}
        data={data.map((input, i) => {
          const l = 90 - i * Math.floor(70 / data.length);
          const hsl = "hsl(120, 73%, " + String(l) + "%)";
          console.log(hsl);
          return {
            id: input.id,
            color: hsl,
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
        //colors={{ scheme: "yellow_green" }}
        colors={(data) => data.color}
        enablePoints={false}
        legends={[
          {
            anchor: "top-left",
            direction: "row",
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

  if (data == undefined) {
    return (
      <IonItem>
        <div>loading...</div>
      </IonItem>
    );
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
        lineOpacity={0.45}
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
    return (
      <IonItem>
        <div>loading...</div>
      </IonItem>
    );
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
    return (
      <IonItem>
        <div>loading...</div>
      </IonItem>
    );
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
    return (
      <IonItem>
        <div>loading...</div>
      </IonItem>
    );
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

const ProgressLine = ({ data /* see data tab */ }) => {
  if (data == null) {
    return null;
  }
  console.log(data);
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveLine
        // data={data}
        data={[
          {
            id: "Your record",
            data: data.filter(({ x }) => x % 1 === 0),
          },
        ]}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "track No.",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "point",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        colors={{ scheme: "accent" }}
        lineWidth={4}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabel="y"
        pointLabelYOffset={-12}
        areaBaselineValue={120}
        areaOpacity={0.45}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
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

const ProgressDraw = ({ folderId }) => {
  const [data, setData] = useState();
  useEffect(() => {
    window
      .fetch(
        ` ${process.env.REACT_APP_API_ENDPOINT}/1/musics/progress/${folderId}`
      )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  if (data == undefined) {
    return (
      <IonItem>
        <div>loading...</div>
      </IonItem>
    );
  }
  return (
    <div>
      <ProgressLine data={data} />
    </div>
  );
};

const ProgressChart = (folderId) => {
  if (folderId == null) {
    return null;
  }

  return (
    <div>
      <ProgressDraw folderId={folderId} />
    </div>
  );
};

const FolderDetail = () => {
  const [chartId, setChartId] = useState("ALL");
  const chartIds = ["ALL", "PITCH", "VOL", "TONE", "PROGRESS"];
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
          {chartIds.map((id) => {
            return <IonSelectOption value={id}>{id}</IonSelectOption>;
          })}
        </IonSelect>
      </IonItem>
      {chartId === "ALL" ? ParallelChart(folderId) : []}
      {chartId === "PITCH" ? FrequencyChart(folderId) : []}
      {chartId === "VOL" ? VolumeChart(folderId) : []}
      {chartId === "TONE" ? ToneChart(folderId) : []}
      {chartId === "PROGRESS" ? ProgressChart(folderId) : []}
    </div>
  );
};

export default FolderDetail;
