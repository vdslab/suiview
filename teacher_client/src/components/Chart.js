import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getFolders, getFolderMusics } from "../services/api/index";

const ShowChart = (folderId, kind) => {
  if (folderId == null) {
    return null;
  }

  if (kind === "progress") {
    return (
      <div>
        <ProgressChart folderId={folderId} />
      </div>
    );
  } else if (kind === "parallel") {
    return (
      <div>
        <ParallelChart folderId={folderId} />
      </div>
    );
  } else if (kind === "pitch") {
    return (
      <div>
        <FrequencyChart folderId={folderId} />
      </div>
    );
  } else if (kind === "vol") {
    return (
      <div>
        <VolumeChart folderId={folderId} />
      </div>
    );
  } else if (kind === "tone") {
    return (
      <div>
        <ToneChart folderId={folderId} />
      </div>
    );
  }
};

const Chart = () => {
  const chartIds = ["PROGRESS", "ALL", "PITCH", "VOL", "TONE"];
  const [chartId, setChartId] = useState(chartIds[0]);
  const path = decodeURI(location.pathname).split("/");
  const username = path[1];
  const folderName = path[3];

  return (
    <section>
      <div className="columns">
        <div className="column is-3">chart</div>
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
      {/*{chartId === "PROGRESS" ? ShowChart(folderId, "progress") : []}
      {chartId === "ALL" ? ShowChart(folderId, "parallel") : []}
      {chartId === "PITCH" ? ShowChart(folderId, "pitch") : []}
      {chartId === "VOL" ? ShowChart(folderId, "vol") : []}
        {chartId === "TONE" ? ShowChart(folderId, "tone") : []}*/}
    </section>
  );
};

export default Chart;
