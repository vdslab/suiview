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
import { useTranslation } from "react-i18next";

const ShowChart = (data) => {
  const { folderId } = useParams();
  const kind = data.kind;
  const { t } = useTranslation();

  if (folderId === undefined) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {kind === t("overallScore") ? <ProgressChart /> : []}
      {kind === t("stackedScore") ? <ParallelChart /> : []}
      {kind === t("pitch") ? <FrequencyChart /> : []}
      {kind === t("intensity") ? <VolumeChart /> : []}
      {kind === t("timber") ? <ToneChart /> : []}
    </div>
  );
};

const FolderChart = (item) => {
  const { t } = useTranslation();
  const chartIds = [t("stackedScore"), t("pitch"), t("intensity"), t("timber")];
  const chartIds2 = [
    t("overallScore"),
    t("stackedScore"),
    t("pitch"),
    t("intensity"),
    t("timber"),
  ];
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
