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

const MusicDetail = () => {
  const [data, setData] = useState(null);
  const { musicId } = useParams();
  const [musicName, setMusicName] = useState();
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
        `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/amplitude`
      )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, [musicId]);
  //console.log(data);

  if (data == undefined) {
    return (
      <IonItem>
        <div>loading...</div>
      </IonItem>
    );
  }
  return (
    <div>
      <AmplitudeChart data={data} />
    </div>
  );
  /*return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/detail/${musicId}`} />
          </IonButtons>
          <IonTitle>
            amplitude No.{musicId} {musicName}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <AmplitudeChart data={data} />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );*/
};

export default MusicDetail;
