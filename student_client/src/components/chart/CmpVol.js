import { useEffect, useState } from "react";
import { IonItem } from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import { getFolderDecibel } from "../../services/api";
import { ManyLiner } from "./drawing";
import { useTranslation } from "react-i18next";

const VolumeChart = ({ folderId }) => {
  const [data, setData] = useState(null);
  const { getAccessTokenSilently } = useAuth0();
  const { t } = useTranslation();

  useEffect(() => {
    getFolderDecibel(folderId, getAccessTokenSilently).then((data) => {
      setData(data);
    });
  }, [folderId, getAccessTokenSilently]);

  if (data == null) {
    return <IonItem lines="none">loading...</IonItem>;
  }
  return (
    <div>
      <ManyLiner data={data} axis_name={t("decibelValue")} />
    </div>
  );
};

export default VolumeChart;
