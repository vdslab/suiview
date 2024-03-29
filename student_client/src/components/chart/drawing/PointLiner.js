import { ResponsiveLine } from "@nivo/line";
import { useTranslation } from "react-i18next";

const PointLiner = ({ data }) => {
  const { t } = useTranslation();

  if (data == null) {
    return null;
  }

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ResponsiveLine
        data={[
          {
            id: "",
            data: data.filter(({ x, _ }) => x % 1 === 0),
          },
        ]}
        margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0,
          max: 300,
          stacked: true,
          reverse: false,
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "track No.",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: t("overallScore"),
          legendOffset: -45,
          legendPosition: "middle",
        }}
        colors={{ scheme: "nivo" }}
        lineWidth={4}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabel="y"
        pointLabelYOffset={-12}
        areaBaselineValue={120}
        areaOpacity={0.45}
        useMesh={true}
      />
    </div>
  );
};
export default PointLiner;
