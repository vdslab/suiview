import { ResponsiveBar } from "@nivo/bar";
import { useTranslation } from "react-i18next";

const Bar = ({ data }) => {
  const { t } = useTranslation();

  if (data === null || data === undefined) {
    return null;
  }

  const languageSupportedData = data.map((item) => {
    const objEn = {
      "No.": item["No."],
      Pitch: item["高さ"],
      Intensity: item["強さ"],
      Timber: item["音色"],
    };
    if (t("pitch") === "Pitch") {
      return objEn;
    }
    return item;
  });

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ResponsiveBar
        data={languageSupportedData}
        keys={[t("pitch"), t("intensity"), t("timber")]}
        indexBy="No."
        margin={{ top: 25, right: 100, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "nivo" }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "#38bcb2",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "#eed312",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "No.",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: t("overallScore"),
          legendPosition: "middle",
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "top-left",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: -20,
            itemsSpacing: 2,
            itemWidth: 80,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 10,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
};

export default Bar;
