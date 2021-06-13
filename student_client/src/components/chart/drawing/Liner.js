import { ResponsiveLine } from "@nivo/line";

const Liner = ({ data, axis_name }) => {
  if (data == null) {
    return null;
  }

  let max = Math.max.apply(
    Math,
    data.map((input) => {
      return input.y;
    })
  );

  let min = 0;
  if (max <= 0) {
    min = -30;
    max = 0;
  } else {
    max += 50;
  }

  const x_padding = Math.round(data.length / 5 / 10) * 10;
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
    if (p % 5 === 0) {
      p += 1;
      return num;
    }
    p += 1;
    return;
  }
  const jiku = data.filter(makeInterval);
  const d = data.filter(makeData);

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ResponsiveLine
        data={[
          {
            id: "x",
            //data: data.filter(({ x }) => x % 5 === 0),
            data: d.filter(({ x }) => x),
          },
        ]}
        margin={{ top: 10, right: 20, bottom: 50, left: 60 }}
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
          /*tickValues: data
            .filter(({ x }) =>x % x_padding === 0)
            .map(({ x }) => x),*/
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
          legendOffset: -50,
          legendPosition: "middle",
        }}
        colors={{ scheme: "nivo" }}
        enablePoints={false}
      />
    </div>
  );
};

export default Liner;
