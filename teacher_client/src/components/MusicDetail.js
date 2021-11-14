import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { putMusicComment, getMusicStability } from "../services/api/index";
import { useAuth0 } from "@auth0/auth0-react";
import {
  CentroidRolloff,
  Decibel,
  ShowFrequency,
} from "../components/chart/index";
import { useTranslation } from "react-i18next";

function Comment() {
  const { getAccessTokenSilently } = useAuth0();
  const { userName, musicId } = useParams();
  const { t } = useTranslation();

  async function sendComment(comment) {
    console.log("send function");
    await putMusicComment(userName, musicId, comment, getAccessTokenSilently);
    document.getElementById("comment").value = "";
    alert(t("transmissionIsComplete"));
  }

  return (
    <div className="has-text-centered">
      <div>
        <textarea
          className="textarea"
          id="comment"
          placeholder={t("writeComment")}
        ></textarea>
        <br />
        <input
          className="button"
          type="button"
          value={t("sendComment")}
          onClick={() => {
            const comment = document.getElementById("comment").value;
            if (comment !== "") {
              sendComment(comment);
            } else {
              alert(t("enterComment"));
            }
          }}
        ></input>
      </div>
    </div>
  );
}

const ShowChart = (data) => {
  const kind = data.data.kind;
  const { musicId } = useParams();
  if (musicId === undefined) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {kind === "PITCH" ? <ShowFrequency /> : []}
      {kind === "VOL" ? <Decibel /> : []}
      {kind === "TONE" ? <CentroidRolloff /> : []}
    </div>
  );
};

const MusicDetail = () => {
  const { t } = useTranslation();
  const chartIds = ["PITCH", "VOL", "TONE"];
  const [chartId, setChartId] = useState(chartIds[0]);
  const { userName, folderId, musicId } = useParams();
  const [stability, steStability] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    (async () => {
      if (userName !== undefined && userName !== "") {
        const data = await getMusicStability(
          userName,
          musicId,
          getAccessTokenSilently
        );
        steStability(data);
      }
    })();
  }, [userName, musicId, getAccessTokenSilently]);
  return (
    <section>
      <div>
        {t("overallScore")}：{stability?.total}&emsp; ({t("pitch")}：
        {stability?.f0}
        &emsp;{t("intensity")}：{stability?.vol}&emsp;{t("timber")}：
        {stability?.tone})
      </div>
      <div className="select is-small ">
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
          return <ShowChart key={id} data={{ id: folderId, kind: data }} />;
        } else {
          return <div key={id}></div>;
        }
      })}
      <Comment />
    </section>
  );
};

export default MusicDetail;
