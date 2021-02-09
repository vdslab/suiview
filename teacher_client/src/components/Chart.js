import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getFolders, getFolderMusics } from "../services/api/index";
//import ProgressChart from "./chart/Progress";
//import VolumeChart from "./chart/";
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
    </div>
  );

  if (kind === "PROGRESS") {
    return (
      <div>
        <ProgressChart data={{ id: folderId, name: userName }} />
      </div>
    );
  } else if (kind === "ALL") {
    return (
      <div>
        <ParallelChart folderId={folderId} />
      </div>
    );
  } else if (kind === "PITCH") {
    return (
      <div>
        <FrequencyChart folderId={folderId} />
      </div>
    );
  } else if (kind === "VOL") {
    return (
      <div>
        <VolumeChart folderId={folderId} />
      </div>
    );
  } else if (kind === "TONE") {
    return (
      <div>
        <ToneChart folderId={folderId} />
      </div>
    );
  }
  return <div></div>;

  /*return <ProgressChart data={{ id: folderId, name: userName }} />;
  /*
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
  }*/
};

const Chart = (item) => {
  const chartIds = ["PROGRESS", "ALL", "PITCH", "VOL", "TONE"];
  const [chartId, setChartId] = useState(chartIds[1]);
  const path = decodeURI(location.pathname).split("/");
  const username = path[1];
  const folderId = item.id;

  return (
    <section>
      <div className="columns">
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

export default Chart;
