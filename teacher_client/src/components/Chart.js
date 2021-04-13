import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FrequencyChart,
  ParallelChart,
  ProgressChart,
  ToneChart,
  VolumeChart,
} from "../components/chart/index";
import { getFolderMusics } from "../services/api/index";
//import FolderChart from "./Chart";;
import { useAuth0 } from "@auth0/auth0-react";

const ShowChart = (data) => {
  const { folderId } = useParams();
  const kind = data.kind;

  if (folderId === undefined) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {kind === "精進グラフ" ? <ProgressChart /> : []}
      {kind === "総合点" ? <ParallelChart /> : []}
      {kind === "高さ" ? <FrequencyChart /> : []}
      {kind === "強さ" ? <VolumeChart /> : []}
      {kind === "音色" ? <ToneChart /> : []}
    </div>
  );
};

const FolderChart = (item) => {
  const chartIds = ["総合点", "高さ", "強さ", "音色"];
  const chartIds2 = ["総合点", "精進グラフ", "高さ", "強さ", "音色"];
  const [musics, setMusics] = useState();
  const { userName, folderId } = useParams();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    (async () => {
      if (folderId !== undefined) {
        const data = await getFolderMusics(
          userName,
          folderId,
          getAccessTokenSilently
        );
        setMusics(data);
      }
    })();
  }, [userName, folderId, getAccessTokenSilently]);

  const count = musics?.length;
  let IdSet = chartIds;
  if (count > 10) {
    IdSet = chartIds2;
  }
  const [chartId, setChartId] = useState(IdSet[0]);

  return (
    <section>
      <div className="select is-small">
        <select
          name="pets"
          id="pet-select"
          onChange={(e) => setChartId(e.currentTarget.value)}
        >
          {IdSet.map((item, id) => {
            return (
              <option value={item} key={id}>
                {item}
              </option>
            );
          })}
        </select>
      </div>

      {IdSet.map((data, id) => {
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
