import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getFolders, getFolderMusics } from "../services/api/index";

import {
  CentroidRolloff,
  Decibel,
  ShowFrequency,
} from "../components/chart/index";
import { Player } from "./Player.js";

const ShowChart = (data) => {
  const kind = data.data.kind;
  const path = decodeURI(location.pathname).split("/");
  const userName = path[1];
  const musicId = path[4];
  console.log("showchart", kind);
  if (musicId === undefined) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {kind === "PITCH" ? (
        <ShowFrequency data={{ id: musicId, name: userName }} />
      ) : (
        []
      )}
      {kind === "VOL" ? <Decibel data={{ id: musicId, name: userName }} /> : []}
      {kind === "TONE" ? (
        <CentroidRolloff data={{ id: musicId, name: userName }} />
      ) : (
        []
      )}
    </div>
  );
};

const MusicDetail = (item) => {
  const chartIds = ["PITCH", "VOL", "TONE"];
  const [chartId, setChartId] = useState(chartIds[0]);
  const path = decodeURI(location.pathname).split("/");
  const username = path[1];
  const folderId = item.id;

  return (
    <section>
      <div>
        <Player />
      </div>

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

export default MusicDetail;
