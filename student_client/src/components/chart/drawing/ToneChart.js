import { ResponsiveLine } from "@nivo/line";

const ToneLiner = ({ data, axis_name }) => {
  if (data == null || data === undefined) {
    return null;
  }
  const x_padding = Math.round(data[0].data.length / 5 / 10) * 10;
  let k = 0;
  function makeInterval(num) {
    if (k % x_padding === 0) {
      k += 1;
      return num;
    }
    k += 1;
    return;
  }
  let p = 0;
  function makeData(num) {
    //console.log(num, k);
    if (p % 5 === 0) {
      p += 1;
      return num;
    }
    p += 1;
    return;
  }
  const jiku = data[1].data.filter(makeInterval);
  const d = data[1].data.filter(makeData);
  //const d2 = data[1].data.filter(makeData);
  //console.log(data);
  //const intervalData = [{id:"centroid", data:d},{id:"rolloff",data:d2}];
  const intervalData = [{ id: "rolloff", data: d }];
  //console.log(intervalData)
  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ResponsiveLine
        data={intervalData.map((input, i) => {
          return {
            id: input.id,
            //data: input.data.filter(({ x }) => x % 5 === 0),
            data: d.filter(({ x }) => x),
          };
        })}
        margin={{ top: 40, right: 20, bottom: 30, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
        }}
        curve="linear"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          tickValues: jiku.map(({ x }) => x),
          legend: "",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: axis_name,
          legendOffset: -40,
          legendPosition: "middle",
        }}
        colors={{ scheme: "nivo" }}
        enablePoints={false}
        legends={[
          {
            anchor: "top-left",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: -30,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 60,
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

export default ToneLiner;
