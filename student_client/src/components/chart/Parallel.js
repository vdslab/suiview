import { useEffect, useState } from "react";
import { IonItem } from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import { getFolderParallel } from "../../services/api";
import { Bar } from "./drawing";
import { useTranslation } from "react-i18next";

const ParallelChart = ({ folderId }) => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getFolderParallel(folderId, getAccessTokenSilently).then((data) => {
      setData(data);
    });
  }, [folderId, getAccessTokenSilently]);

  if (data == null) {
    return <IonItem lines="none">loading...</IonItem>;
  }
  return (
    <div>
      <IonItem lines="none">{t("max10")}</IonItem>
      <Bar data={data} />
    </div>
  );
};

export default ParallelChart;
