import { ResponsiveLine } from "@nivo/line";

const Liner = ({ data }) => {
  if (data == null) {
    return null;
  }

  let max = Math.max.apply(
    Math,
    data.map((input) => {
      return input.y;
    })
  );

  console.log(max);

  let min = 0;
  if (max <= 0) {
    min = -30;
    max = 0;
  } else {
    max += 50;
  }
  console.log(max);
  console.log(min);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveLine
        data={[
          {
            id: "x",
            data: data.filter(({ x }) => x % 5 === 0),
            //data: data.filter(({ x }) => x),
          },
        ]}
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: min,
          max: max,
        }}
        curve="linear"
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
      />
    </div>
  );
};

export default Liner;
