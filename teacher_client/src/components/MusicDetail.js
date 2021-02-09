import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  getFolders,
  getFolderMusics,
  putMusicComment,
} from "../services/api/index";

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
    // await putMusicComment(userName, musicId, comment, writer);
    document.getElementById("comment").value = "";
    document.getElementById("writer").value = "";
    alert("送信されました");
    // setComments(data);
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
  const musicId = path[4];
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
          return <ShowChart key={id} data={{ id: folderId, kind: data }} />;
        } else {
          return <div key={id}></div>;
        }
      })}
      <Comment data={{ username: username, musicId: musicId }} />
    </section>
  );
};

export default MusicDetail;
