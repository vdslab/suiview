import { ResponsiveParallelCoordinates } from "@nivo/parallel-coordinates";

//現在は使ってない
const ParallelCoordinates = ({ data }) => {
  if (data === null || data === undefined) {
    return null;
  }

  console.log(data);
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
  );

  return (
    <div style={{ width: "100%", height: "350px" }}>
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
            min: pich_max,
            max: pich_min,
            //min: "auto",
            //max: "auto",
            ticksPosition: "before",
            legend: "ptich",
            legendPosition: "start",
            legendOffset: 20,
          },
          {
            key: "tone",
            type: "linear",
            min: max,
            max: min,
            //min: "auto",
            //max: "auto",
            ticksPosition: "before",
            legend: "tone",
            legendPosition: "start",
            legendOffset: 20,
          },
          {
            key: "volume",
            type: "linear",
            padding: 1,
            min: vol_max,
            max: vol_min,
            //min: "auto",
            //max: "auto",
            ticksPosition: "before",
            legend: "volume",
            legendPosition: "start",
            legendOffset: 20,
          },
        ]}
        axesPlan="foreground"
        strokeWidth={3}
        //lineOpacity={0.1}
        margin={{ top: 20, right: 10, bottom: 50, left: 30 }}
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
