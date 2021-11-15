import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getFolderParallel } from "../../services/api";
//import { ParallelCoordinates } from "./drawing";
import { Bar } from "./drawing";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ParallelChart = () => {
  const [data, setData] = useState(null);
  const { userName, folderId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const { t } = useTranslation();

  useEffect(() => {
    getFolderParallel(userName, folderId, getAccessTokenSilently).then(
      (data) => {
        setData(data);
      }
    );
  }, [userName, folderId, getAccessTokenSilently]);

  if (data == null) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <div lines="none">{t("max10")}</div>
      <Bar data={data} />
    </div>
  );
};

export default ParallelChart;
