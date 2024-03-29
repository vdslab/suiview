import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getFolderTone } from "../../services/api";
import { ManyLiner } from "./drawing";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ToneChart = () => {
  const [data, setData] = useState(null);
  const { folderId, userName } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const { t } = useTranslation();
  useEffect(() => {
    getFolderTone(userName, folderId, getAccessTokenSilently).then((data) => {
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

export default ToneChart;
