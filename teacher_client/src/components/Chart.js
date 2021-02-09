import { useEffect, useState } from "react";
import {
  FrequencyChart,
  ParallelChart,
  ProgressChart,
  ToneChart,
  VolumeChart,
} from "../components/chart/index";

const ShowChart = (data) => {
  const folderId = data.data.id;
  const userName = data.data.userName;
  const kind = data.data.kind;
  console.log("showchart", kind);
  if (folderId === undefined) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {kind === "PROGRESS" ? (
        <ProgressChart data={{ id: folderId, name: userName }} />
      ) : (
        []
      )}
      {kind === "ALL" ? (
        <ParallelChart data={{ id: folderId, name: userName }} />
      ) : (
        []
      )}
      {kind === "PITCH" ? (
        <FrequencyChart data={{ id: folderId, name: userName }} />
      ) : (
        []
      )}
      {kind === "VOL" ? (
        <VolumeChart data={{ id: folderId, name: userName }} />
      ) : (
        []
      )}
      {kind === "TONE" ? (
        <ToneChart data={{ id: folderId, name: userName }} />
      ) : (
        []
      )}
    </div>
  );
};

const FolderChart = (item) => {
  const chartIds = ["PROGRESS", "ALL", "PITCH", "VOL", "TONE"];
  const [chartId, setChartId] = useState(chartIds[4]);
  const path = decodeURI(location.pathname).split("/");
  const username = path[1];
  const folderId = item.id;

  return (
    <section>
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

      {chartIds.map((data, id) => {
        console.log(data, chartId);
        if (data === chartId) {
          return (
            <ShowChart
              key={id}
              data={{ id: folderId, kind: data, userName: username }}
            />
          );
        } else {
          return <div key={id}></div>;
        }
      })}
    </section>
  );
};

export default FolderChart;
