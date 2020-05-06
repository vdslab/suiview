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
  IonLabel,
} from "@ionic/react";
import { ResponsiveBar } from "@nivo/bar";

const FourierChart = ({ data }) => {
  if (data == null) {
    return null;
  }
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveBar
        data={data}
        keys={["count"]}
        indexBy="tag"
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
          legend: "",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "count",
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

const ShowFourier = (id) => {
  console.log();
  const [showAlert, setShowAlert] = useState(false);
  const [data, setData] = useState(null);

  const music_num = [];
  for (let i = 15; i <= 20; i++) {
    music_num.push(i);
  }

  useEffect(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics/15/amplitude`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  return (
    <IonContent>
      <FourierChart data={data} />
    </IonContent>
  );
};

export default ShowFourier;
