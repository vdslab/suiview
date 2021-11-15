import { ResponsiveLine } from "@nivo/line";
import { useTranslation } from "react-i18next";

const ManyLiner = ({ data, axis_name }) => {
  const { t } = useTranslation();

  if (data == null || data === undefined) {
    return null;
  }

  let p = 0;
  function makeData(num) {
    if (p % 5 === 0) {
      p += 1;
      return num;
    }
    p += 1;
    return;
  }

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ResponsiveLine
        data={data.map((input) => {
          p = 0;
          return {
            id: input.id,
            data: input.data.filter(makeData),
          };
        })}
        margin={{ top: 40, right: 20, bottom: 40, left: 60 }}
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
          tickValues: [0].map((x) => {
            return x;
          }),
          legend: t("time"),
          legendOffset: 30,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: axis_name,
          legendOffset: -50,
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

export default ManyLiner;
