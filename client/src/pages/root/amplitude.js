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
} from "@ionic/react";
import { ResponsiveLine } from "@nivo/line";

const AmplitudeChart = ({ data }) => {
  if (data == null) {
    return null;
  }
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveLine
        data={[
          {
            id: "amplitude",
            data: data.filter(({ x }) => x % 100 === 0),
          },
        ]}
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          tickValues: data.filter(({ x }) => x % 10000 === 0).map(({ x }) => x),
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
        enableGridX={false}
        enableGridY={false}
        enablePoints={false}
      />
    </div>
  );
};

const ShowAmplitude = (id) => {
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
      <AmplitudeChart data={data} />
    </IonContent>
  );
};

export default ShowAmplitude;
