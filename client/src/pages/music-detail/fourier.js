import React, { useEffect, useState } from "react";
import {
  IonHeader,
  IonItem,
  IonList,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import { ResponsiveBar } from "@nivo/bar";
import { useParams } from "react-router-dom";

const FourierChart = ({ data }) => {
  if (data == null) {
    return null;
  }
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveBar
        data={data}
        /*data={[
          {
            id: "x",
            data: data.filter(({ x }) => x % 1 === 0),
            //data: data.filter(({ x }) => x),
          },
        ]}*/
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

const ShowFourier = () => {
  const [data, setData] = useState(null);
  const { musicId } = useParams();
  const [musicName, setMusicName] = useState();
  const [roll, setRoll] = useState();

  useEffect(() => {
    window
      .fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/fourier`
      )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, [musicId]);

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
        `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/fourier_roll`
      )
      .then((response) => response.json())
      .then((roll) => {
        setRoll(roll);
      });
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/detail/${musicId}`} />
          </IonButtons>
          <IonTitle>
            fourier No.{musicId} {musicName}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          ロールオフ： {roll}
          <IonItem>
            <FourierChart data={data} />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ShowFourier;
