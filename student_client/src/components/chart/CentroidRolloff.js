import { useEffect, useState } from "react";
import { IonItem } from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import { getMusicSpectrumRolloff } from "../../services/api";
import { Liner } from "./drawing";
import { useTranslation } from "react-i18next";

const CentroidRolloff = ({ musicId }) => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const rolloffRequest = getMusicSpectrumRolloff(
      musicId,
      getAccessTokenSilently
    );
    Promise.all([rolloffRequest]).then(([rolloff]) => {
      setData(rolloff);
    });
  }, [musicId, getAccessTokenSilently]);

  if (data == null) {
    return <IonItem lines="none">loading...</IonItem>;
  }
  return <Liner data={data.values} axis_name={t("frequency")} />;
};

export default CentroidRolloff;
