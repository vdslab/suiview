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

const AmplitudeChart = ({ data }) => {
  if (data == null) {
    return null;
  }
  const d = parseInt(data.length / 10, 10);
  console.log(d);
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveLine
        data={[
          {
            id: "amplitude",
            data: data /*.filter(({ x }) => x % 1 === 0)*/,
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
          tickValues: data.filter(({ x }) => x % d === 0).map(({ x }) => x),
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

const Decibel = () => {
  const [data, setData] = useState(null);
  const { musicId } = useParams();
  const [musicName, setMusicName] = useState();
  const [ave, setAve] = useState();

  useEffect(() => {
    window
      .fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/music_name`
      )
      .then((response) => response.json())
      .then((musicName) => {
        setMusicName(musicName);
      });
  }, []);

  useEffect(() => {
    window
      .fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/decibel`
      )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, [musicId]);

  useEffect(() => {
    window
      .fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/decibel_ave`
      )
      .then((response) => response.json())
      .then((ave) => {
        setAve(ave);
      });
  }, []);
  console.log(data);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/detail/${musicId}`} />
          </IonButtons>
          <IonTitle>
            Decibel No.{musicId} {musicName}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          安定度： {ave}
          <IonItem>
            <AmplitudeChart data={data} />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Decibel;
