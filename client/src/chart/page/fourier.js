import React, { useEffect, useState } from "react";
import { IonItem } from "@ionic/react";
import { ResponsiveBar } from "@nivo/bar";
import { useParams } from "react-router-dom";
import { useFetch_get } from "../root/index";
import Liner from "../drawing/liner";
/*
const FourierChart = ({ data }) => {
  if (data == null) {
    return null;
  }
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveBar
        data={data}
        
        keys={["y"]}
        indexBy="x"
        margin={{ top: 20, right: 20, bottom: 120, left: 60 }}
        padding={0.3}
        colors={{ scheme: "nivo" }}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 60,
          tickValues: data.filter(({ x }) => x % 500 === 0).map(({ x }) => x),
          legend: "",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
};
*/
const ShowFourier = () => {
  const { musicId } = useParams();
  const data = useFetch_get(
    `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/fourier`
  );
  console.log(data);

  if (data == undefined) {
    return (
      <IonItem>
        <div>loading...</div>
      </IonItem>
    );
  }
  return (
    <div>
      <Liner data={data} />
    </div>
  );
};

export default ShowFourier;
