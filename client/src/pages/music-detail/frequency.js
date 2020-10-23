import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IonItem } from "@ionic/react";
import { ResponsiveLine } from "@nivo/line";
import { useFetch_get } from "../root";

const FrequencyChart = ({ data }) => {
  if (data == null) {
    return null;
  }
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveLine
        data={[
          {
            id: "x",
            data: data.filter(({ x }) => x % 5 === 0),
            //data: data.filter(({ x }) => x),
          },
        ]}
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
          tickValues: data.filter(({ x }) => x % 50 === 0).map(({ x }) => x),
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
        colors={{ scheme: "nivo" }}
        enablePoints={false}
      />
    </div>
  );
};
const ShowFrequency = () => {
  const { musicId } = useParams();
  const ave = useFetch_get(
    `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/frequency_ave`
  );
  const data = useFetch_get(
    `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/frequency`
  );

  if (data == undefined) {
    return (
      <IonItem>
        <div>loading...</div>
      </IonItem>
    );
  }
  return (
    <div>
      <IonItem lines="none"> 安定度... {ave}</IonItem>
      <FrequencyChart data={data} />
    </div>
  );
};

export default ShowFrequency;
