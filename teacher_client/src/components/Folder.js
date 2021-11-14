import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { getFolderMusics } from "../services/api/index";
import FolderChart from "./Chart";
import MusicDetail from "./MusicDetail";
import { useAuth0 } from "@auth0/auth0-react";
import { Player } from "./Player";
import { useTranslation } from "react-i18next";

const FolderList = () => {
  const [musics, setMusics] = useState();
  const path = useLocation().pathname.split("/");
  const { userName, folderId, musicId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const { t } = useTranslation();

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

  if (musics?.length === 0) {
    return <div>{t("noData")}</div>;
  }

  return (
    <section>
      <h1
        className="has-text-weight-bold"
        style={{ textDecoration: "underline", paddingBottom: "0.5rem" }}
      >
        {t("songs")}
      </h1>{" "}
      <div className="columns">
        <div className="column is-4">
          {" "}
          <section>
            <ul>
              {musics?.map((data, i) => {
                return (
                  <li key={data.id} className="columns">
                    <p style={{ paddingTop: "15px" }}>No.{i + 1}</p>

                    <div className="column is-3">
                      <Player id={data.id} />
                    </div>
                    <div className="column is-6">
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
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
        <div
          className="column"
          style={{ paddingTop: 0, marginTop: "-1.25rem" }}
        >
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
