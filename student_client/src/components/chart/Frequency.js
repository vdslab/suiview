import { useEffect, useState } from "react";
import { IonItem } from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import { getMusicF0 } from "../../services/api";
import { Liner } from "./drawing";
import { useTranslation } from "react-i18next";

const ShowFrequency = ({ musicId }) => {
  const [data, setData] = useState(null);
  const { getAccessTokenSilently } = useAuth0();
  const { t } = useTranslation();

  useEffect(() => {
    getMusicF0(musicId, getAccessTokenSilently).then((data) => {
      setData(data);
    });
  }, [musicId, getAccessTokenSilently]);

  if (data == null) {
    return <IonItem lines="none">loading...</IonItem>;
  }
  return <Liner data={data.values} axis_name={t("frequency")} />;
};

export default ShowFrequency;
