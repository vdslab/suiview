import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getFolders, getFolderMusics } from "../services/api/index";
import Chart from "./Chart";

const FolderList = () => {
  const [musics, setMusics] = useState();
  const path = decodeURI(location.pathname).split("/");
  const username = path[1];
  const folderId = path[3];

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
          <Chart id={folderId} />
        </div>
      </div>
    </section>
  );
};

export default FolderList;
