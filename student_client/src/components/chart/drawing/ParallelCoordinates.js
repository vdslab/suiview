import { ResponsiveParallelCoordinates } from "@nivo/parallel-coordinates";
import { useTranslation } from "react-i18next";

const ParallelCoordinates = ({ data }) => {
  const { t } = useTranslation();

  if (data === null || data === undefined) {
    return null;
  }

  /*console.log(data);
  const max = Math.max.apply(
    Math,
    data.map((input) => {
      return input.tone;
    })
  );
  const min = Math.min.apply(
    Math,
    data.map((input) => {
      return input.tone;
    })
  );

  const pich_max = Math.max.apply(
    Math,
    data.map((input) => {
      return input.pich;
    })
  );

  const pich_min = Math.min.apply(
    Math,
    data.map((input) => {
      return input.pich;
    })
  );

  const vol_max = Math.max.apply(
    Math,
    data.map((input) => {
      return input.volume;
    })
  );

  const vol_min = Math.min.apply(
    Math,
    data.map((input) => {
      return input.volume;
    })
  );*/

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ResponsiveParallelCoordinates
        data={data}
        variables={[
          {
            key: "No.",
            type: "point",
            min: "auto",
            max: "auto",
            ticksPosition: "before",
            legend: "No.",
            legendPosition: "start",
            legendOffset: 20,
          },
          {
            key: "pich",
            type: "linear",
            min: "auto",
            max: 100,
            ticksPosition: "before",
            legend: t("pitch"),
            legendPosition: "start",
            legendOffset: 20,
          },
          {
            key: "tone",
            type: "linear",
            min: "auto",
            max: 100,
            ticksPosition: "before",
            legend: t("timber"),
            legendPosition: "start",
            legendOffset: 20,
          },
          {
            key: "volume",
            type: "linear",
            padding: 1,
            min: "auto",
            max: 100,
            ticksPosition: "before",
            legend: t("intensity"),
            legendPosition: "start",
            legendOffset: 20,
          },
        ]}
        axesPlan="foreground"
        strokeWidth={3}
        margin={{ top: 20, right: 60, bottom: 50, left: 20 }}
        animate={true}
        motionStiffness={90}
        motionDamping={12}
        colors={{ scheme: "yellow_green" }}
        lineOpacity={0.45}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: "rgb(136, 158, 174)",
                strokeWidth: 2,
              },
            },
            ticks: {
              line: {
                stroke: "rgb(136, 158, 174)",
                strokeWidth: 2,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default ParallelCoordinates;
