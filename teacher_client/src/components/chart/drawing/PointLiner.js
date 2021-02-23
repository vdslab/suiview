import { ResponsiveLine } from "@nivo/line";

const PointLiner = ({ data }) => {
  if (data == null) {
    return null;
  }

  return (
    <div style={{ width: "100%", height: "350px" }}>
      <ResponsiveLine
        data={[
          {
            id: "Your record",
            data: data.filter(({ x, _ }) => x % 1 === 0),
          },
        ]}
        margin={{ top: 20, right: 10, bottom: 50, left: 30 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
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
          legend: "総合点",
          legendOffset: -45,
          legendPosition: "middle",
        }}
        colors={{ scheme: "accent" }}
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
