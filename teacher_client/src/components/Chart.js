import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  FrequencyChart,
  ParallelChart,
  ProgressChart,
  ToneChart,
  VolumeChart,
} from "../components/chart/index";

const ShowChart = (data) => {
  const { folderId } = useParams();
  const kind = data.kind;

  if (folderId === undefined) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {kind === "PROGRESS" ? <ProgressChart /> : []}
      {kind === "ALL" ? <ParallelChart /> : []}
      {kind === "PITCH" ? <FrequencyChart /> : []}
      {kind === "VOL" ? <VolumeChart /> : []}
      {kind === "TONE" ? <ToneChart /> : []}
    </div>
  );
};

const FolderChart = () => {
  const chartIds = ["PROGRESS", "ALL", "PITCH", "VOL", "TONE"];
  const [chartId, setChartId] = useState(chartIds[0]);
  return (
    <section>
      <div className="select is-small">
        <select
          name="pets"
          id="pet-select"
          onChange={(e) => setChartId(e.currentTarget.value)}
        >
          {chartIds.map((item, id) => {
            return (
              <option value={item} key={id}>
                {item}
              </option>
            );
          })}
        </select>
      </div>

      {chartIds.map((data, id) => {
        if (data === chartId) {
          return <ShowChart key={id} kind={data} />;
        } else {
          return <div key={id}></div>;
        }
      })}
    </section>
  );
};

export default FolderChart;
