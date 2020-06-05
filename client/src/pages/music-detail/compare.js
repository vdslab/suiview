import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IonHeader,
  IonItem,
  IonList,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import { ResponsiveLine } from "@nivo/line";

const FrequencyChart = ({ data }) => {
  if (data == null) {
    return null;
  }
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveLine
        /* data={[
          {
            id: "x",
            data: data.filter(({ x }) => x % 5 === 0),
            //data: data.filter(({ x }) => x),
          },
        ]*/
        data={data}
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
          tickValues: data.filter(({ x }) => x % 500 === 0).map(({ x }) => x),
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

const ShowComp = () => {
  const [data, setData] = useState(null);
  const { musicId } = useParams();

  useEffect(() => {
    window
      .fetch(
        `http://localhost:8080/1/musics/18/comp_chart`
        //`${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/comp_chart`
      )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, [musicId]);
  console.log(data);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>compare track{musicId}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <FrequencyChart data={data} />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ShowComp;
