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
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonCard,
} from "@ionic/react";
import { ResponsiveLine } from "@nivo/line";

const FrequencyChart = ({ data }) => {
  if (data == null) {
    return null;
  }

  /*const Data = data.map((input) => {
    input.data.filter((x) => x % 5 == 0);
  });*/
  data.map((input) => {
    input.data.filter((x) => x % 5 == 0);
  });
  //console.log(data);
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveLine
        data={data.map((input) => {
          return {
            id: input.id,
            data: input.data.filter(({ x }) => x % 5 == 0),
          };
        })}
        /*data={[
          {
            //id: "x",
            data: data.filter(({ x }) => x % 5 === 0),
            //data: data.filter(({ x }) => x),
          },
        ]}*/
        //data={data}
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
        colors={{ scheme: "category10" }}
        enablePoints={false}
        legends={[
          {
            anchor: "top-left",
            direction: "column",
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

const ShowComp = () => {
  const [data, setData] = useState(null);
  const { musicId } = useParams();
  const { musicId2 } = useParams();
  const [comp1, setComp1] = useState(musicId);
  const [comp2, setComp2] = useState(musicId2);

  useEffect(() => {
    window
      .fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/comp_chart/${musicId2}`
      )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, [musicId]);
  //console.log(data);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/detail/${musicId}`} />
          </IonButtons>
          <IonTitle>
            compare track{musicId} and tarck{musicId2}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLabel>比較したいものを入れてね</IonLabel>
        <IonCard>
          <IonItem lines="none">
            trackNo.
            <IonInput
              color="medium"
              value={comp1}
              onIonChange={(e) => setComp1(e.target.value)}
            />
            trackNo.
            <IonInput
              color="medium"
              value={comp2}
              onIonChange={(e) => setComp2(e.target.value)}
            />
            <IonButton
              size="big"
              color="dark"
              key={comp1}
              routerLink={`/comp_chart/${comp1}/${comp2}`}
            >
              compare
            </IonButton>
          </IonItem>
        </IonCard>

        <IonList>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonLabel>trackNo.{musicId}</IonLabel>
                <IonItem>
                  <audio
                    controls
                    src={`${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/content`}
                  />
                </IonItem>
              </IonCol>
              <IonCol>
                <IonLabel>trackNo.{musicId2}</IonLabel>
                <IonItem>
                  <audio
                    controls
                    src={`${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId2}/content`}
                  />
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonList>

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
