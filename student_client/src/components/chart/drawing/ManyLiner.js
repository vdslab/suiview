import { ResponsiveLine } from "@nivo/line";

const ManyLiner = ({ data }) => {
  if (data == null || data === undefined) {
    return null;
  }
  const x_padding = Math.round(data[0].data.length / 5 / 10) * 10;
  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ResponsiveLine
        data={data.map((input) => {
          return {
            id: input.id,
            data: input.data.filter(({ x }) => x % 5 === 0),
          };
        })}
        margin={{ top: 40, right: 20, bottom: 50, left: 60 }}
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
          tickValues: data.length
            ? data[0].data
                .filter(({ x }) => x % x_padding === 0)
                .map(({ x }) => x)
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

export default ManyLiner;
