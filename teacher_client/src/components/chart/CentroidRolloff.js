import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getMusicSpectrumRolloff } from "../../services/api";
import { Liner } from "./drawing";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CentroidRolloff = () => {
  const { userName, musicId } = useParams();
  const [data, setData] = useState(null);
  const { getAccessTokenSilently } = useAuth0();
  const { t } = useTranslation();

  useEffect(() => {
    const rolloffRequest = getMusicSpectrumRolloff(
      userName,
      musicId,
      getAccessTokenSilently
    );
    Promise.all([rolloffRequest]).then(([rolloff]) => {
      setData(rolloff.values);
    });
  }, [userName, musicId, getAccessTokenSilently]);

  if (data == null) {
    return <div>loading...</div>;
  }
  return <Liner data={data} axis_name={t("frequency")} />;
};

export default CentroidRolloff;
