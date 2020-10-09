import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IonItem } from "@ionic/react";
import { ResponsiveLine } from "@nivo/line";

const AmplitudeChart = ({ data }) => {
  if (data == null) {
    return null;
  }

  const floatData = data.map((x, i) => {
    return { x: i, y: parseFloat(x.y) };
  });
  console.log(floatData);
  console.log(data);
  const d = parseInt(data.length / 100, 10);
  console.log(d);
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveLine
        data={[
          {
            id: "amplitude",
            data: floatData.filter(({ x }) => x % d === 0),
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

const Flatness = () => {
  const [data, setData] = useState(null);
  const { musicId } = useParams();

  useEffect(() => {
    window
      .fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/spectrum_flatness`
      )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

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
};

export default Flatness;
