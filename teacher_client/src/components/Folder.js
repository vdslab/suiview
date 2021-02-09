import { useEffect, useState } from "react";
import { getFolderMusics } from "../services/api/index";
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
                    <a href={`/${username}/folder/${folderId}/${data.id}`}>
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
