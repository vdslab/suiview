import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ManyLiner } from "./drawing";
import { getFolderF0 } from "../../services/api";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FrequencyChart = () => {
  const [data, setData] = useState(null);
  const { userName, folderId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const { t } = useTranslation();

  useEffect(() => {
    getFolderF0(userName, folderId, getAccessTokenSilently).then((data) => {
      setData(data);
    });
  }, [userName, folderId, getAccessTokenSilently]);

  if (data == null) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <ManyLiner data={data} axis_name={t("frequency")} />
    </div>
  );
};

export default FrequencyChart;
