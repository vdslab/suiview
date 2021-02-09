import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFolderMusics } from "../services/api/index";
import FolderChart from "./Chart";
import MusicDetail from "./MusicDetail";

const FolderList = () => {
  const [musics, setMusics] = useState();
  const path = decodeURI(location.pathname).split("/");
  const { userName, folderId } = useParams();
  console.log("here");
  console.log(userName);
  console.log(folderId);

  useEffect(() => {
    (async () => {
      console.log("inside");
      if (folderId !== undefined) {
        const data = await getFolderMusics(userName, folderId);
        setMusics(data);
      }
    })();
  }, [folderId]);

  if (musics?.length === 0) {
    return <div>録音データがありません</div>;
  }

  console.log(musics);

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
                    <a href={`/${userName}/folder/${folderId}/${data.id}`}>
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
            <FolderChart />
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
