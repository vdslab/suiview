import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getFolders, getFolderMusics } from "../services/api/index";
import FolderChart from "./Chart";
import MusicDetail from "./MusicDetail";

const FolderList = () => {
  const [musics, setMusics] = useState();
  const path = decodeURI(location.pathname).split("/");
  const username = path[1];
  const folderId = path[3];
  console.log(path.length);

  useEffect(async () => {
    if (folderId !== undefined) {
      const data = await getFolderMusics(username, folderId);
      setMusics(data);
    }
  }, []);

  if (musics?.length === 0) {
    return <div>録音データがありません</div>;
  }

  return (
    <section>
      <div className="columns">
        <div className="column is-3">
          {" "}
          <section>
            <ul>
              {musics?.map((data) => {
                return (
                  <li key={data.id}>
                    <a
                      href={`http://localhost:3000/${username}/folder/${folderId}/${data.id}`}
                    >
                      {data.name === undefined ? (
                        <div>no name</div>
                      ) : (
                        <div>{data.name}</div>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
        <div className="column">
          {path.length === 4 ? (
            <FolderChart id={folderId} />
          ) : path.length === 5 ? (
            <div>
              <MusicDetail />
              <div className="has-text-centered">
                <form method="post">
                  <textarea class="textarea"></textarea>
                  <br /> <label>write by</label>
                  <input
                    type="text"
                    class="input"
                    placeholder="あなたの名前を記入してください"
                  ></input>
                  <br />
                  <input type="submit" value="コメントを送る"></input>
                </form>
              </div>
            </div>
          ) : (
            []
          )}
        </div>
      </div>
    </section>
  );
};

export default FolderList;
