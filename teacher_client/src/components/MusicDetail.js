import { useState } from "react";
import { useParams } from "react-router";
import { putMusicComment } from "../services/api/index";

import {
  CentroidRolloff,
  Decibel,
  ShowFrequency,
} from "../components/chart/index";
import { Player } from "./Player.js";

function Comment(item) {
  const userName = item.data.username;
  const musicId = item.data.musicId;
  console.log(musicId, userName);

  async function sendComment(comment, writer) {
    console.log("send function");
    await putMusicComment(userName, musicId, comment, writer);
    document.getElementById("comment").value = "";
    document.getElementById("writer").value = "";
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
        <br /> <label>write by</label>
        <input
          id="writer"
          type="text"
          className="input"
          placeholder="あなたの名前を記入してください"
        ></input>
        <br />
        <input
          type="button"
          value="コメントを送る"
          onClick={() => {
            const comment = document.getElementById("comment").value;
            const writer = document.getElementById("writer").value;
            console.log(comment, writer);
            if (comment !== "" && writer !== "") {
              sendComment(comment, writer);
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
  const { userName, musicId, folderId } = useParams();

  return (
    <section>
      <div>
        <Player />
      </div>
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
        console.log(data, chartId);
        if (data === chartId) {
          return <ShowChart key={id} data={{ id: folderId, kind: data }} />;
        } else {
          return <div key={id}></div>;
        }
      })}
      <Comment data={{ username: userName, musicId: musicId }} />
    </section>
  );
};

export default MusicDetail;