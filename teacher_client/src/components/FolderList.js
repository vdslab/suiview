import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getFolders } from "../services/api/index";
import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";

const FolderList = () => {
  const [folders, setFolders] = useState();
  const { userName, folderId } = useParams(undefined);
  const { getAccessTokenSilently } = useAuth0();
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      if (userName !== undefined && userName !== "") {
        const data = await getFolders(userName, getAccessTokenSilently);
        setFolders(data);
      }
    })();
  }, [userName, getAccessTokenSilently]);

  return (
    <section>
      <h1
        className="has-text-weight-bold"
        style={{ textDecoration: "underline", paddingBottom: "0.5rem" }}
      >
        {t("folders")}
      </h1>
      <ul>
        {folders?.map((data) => {
          return (
            <li key={data.id}>
              <Link
                to={`/${userName}/folder/${data.id}`}
                className={
                  data.id !== parseInt(folderId)
                    ? "has-text-black"
                    : "has-text-blue"
                }
              >
                {data.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default FolderList;
