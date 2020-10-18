import React, { useEffect, useState } from "react";
import { IonItem } from "@ionic/react";
import { useParams } from "react-router-dom";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { useFetch_get } from "../root/index";

const HeatMapChart = ({ data }) => {
  if (data == null) {
    return null;
  }
  const key_num = [];
  for (let i = 0; i < data.length - 1; i++) {
    key_num.push(String(i));
  }
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveHeatMap
        data={data}
        keys={key_num}
        indexBy="y"
        margin={{ top: 100, right: 60, bottom: 60, left: 60 }}
        forceSquare={true}
        axisTop={{
          orient: "top",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -90,
          legend: "",
          legendOffset: 36,
        }}
        axisRight={null}
        axisBottom={null}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        cellOpacity={1}
        cellBorderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.8]] }}
        defs={[
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(0, 0, 0, 0.1)",
            rotation: -45,
            lineWidth: 4,
            spacing: 7,
          },
        ]}
        fill={[{ id: "lines" }]}
        animate={true}
        motionStiffness={80}
        motionDamping={9}
        hoverTarget="cell"
        cellHoverOthersOpacity={0.25}
      />
    </div>
  );
};

const ShowSpectrogram = () => {
  // const [data, setData] = useState(null);
  const { musicId } = useParams();
  const data = useFetch_get(
    `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/spectrogram`
  );

  /*useEffect(() => {
    window
      .fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/spectrogram`
      )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, [musicId]);*/

  if (data == undefined) {
    return (
      <IonItem>
        <div>loading...</div>
      </IonItem>
    );
  }
  return (
    <div>
      <HeatMapChart data={data} />
    </div>
  );
};

export default ShowSpectrogram;
