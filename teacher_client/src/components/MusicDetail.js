import { useState } from "react";
import { useParams } from "react-router";
import { putMusicComment } from "../services/api/index";
import { useAuth0 } from "@auth0/auth0-react";
import {
  CentroidRolloff,
  Decibel,
  ShowFrequency,
} from "../components/chart/index";

function Comment() {
  const { getAccessTokenSilently } = useAuth0();
  const { userName, musicId } = useParams();

  async function sendComment(comment) {
    console.log("send function");
    await putMusicComment(userName, musicId, comment, getAccessTokenSilently);
    document.getElementById("comment").value = "";
    alert("送信されました");
  }

  return (
    <div className="has-text-centered">
      <div>
        <textarea
          className="textarea"
          id="comment"
          placeholder="コメントを書いてください"
        ></textarea>
        <br />
        <input
          className="button"
          type="button"
          value="コメントを送る"
          onClick={() => {
            const comment = document.getElementById("comment").value;
            if (comment !== "") {
              sendComment(comment);
            } else {
              alert("記入漏れがあります");
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
  const chartIds = ["PITCH", "VOL", "TONE"];
  const [chartId, setChartId] = useState(chartIds[0]);
  const { folderId } = useParams();

  return (
    <section>
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
