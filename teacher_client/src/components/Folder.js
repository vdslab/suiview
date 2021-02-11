import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { getFolderMusics } from "../services/api/index";
import FolderChart from "./Chart";
import MusicDetail from "./MusicDetail";
import { useAuth0 } from "@auth0/auth0-react";

const FolderList = () => {
  const [musics, setMusics] = useState();
  const path = useLocation().pathname.split("/");
  console.log(path);
  const { userName, folderId, musicId } = useParams();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    (async () => {
      if (folderId !== undefined) {
        console.log("AAAAA");
        const data = await getFolderMusics(
          userName,
          folderId,
          getAccessTokenSilently
        );
        setMusics(data);
      }
    })();
  }, [userName, folderId, getAccessTokenSilently]);

  if (musics?.length === 0) {
    return <div>録音データがありません</div>;
  }

  console.log(musics);

  return (
    <section>
      <h1
        className="has-text-weight-bold"
        style={{ textDecoration: "underline", paddingBottom: "0.5rem" }}
      >
        録音データ
      </h1>{" "}
      <div className="columns">
        <div className="column is-3">
          {" "}
          <section>
            <ul>
              {musics?.map((data) => {
                console.log(data.id, parseInt(musicId));
                return (
                  <li key={data.id}>
                    <Link
                      to={`/${userName}/folder/${folderId}/${data.id}`}
                      className={
                        data.id !== parseInt(musicId)
                          ? "has-text-black"
                          : "has-text-blue"
                      }
                    >
                      {data.name === undefined ? (
                        <div>no name</div>
                      ) : (
                        <div>{data.name}</div>
                      )}
                    </Link>
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
