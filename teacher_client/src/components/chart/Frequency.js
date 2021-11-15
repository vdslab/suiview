import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getMusicF0 } from "../../services/api/music";
import { Liner } from "./drawing";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ShowFrequency = () => {
  const [data, setData] = useState(null);
  const { userName, musicId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const { t } = useTranslation();
  useEffect(() => {
    getMusicF0(userName, musicId, getAccessTokenSilently).then((data) => {
      setData(data);
    });
  }, [userName, musicId, getAccessTokenSilently]);

  if (data == null) {
    return <div>loading...</div>;
  }
  return <Liner data={data.values} axis_name={t("frequency")} />;
};

export default ShowFrequency;
