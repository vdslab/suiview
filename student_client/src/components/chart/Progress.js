import { useEffect, useState } from "react";
import { IonItem } from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import { getFolderProgress } from "../../services/api";
import { PointLiner } from "./drawing";

const ProgressChart = ({ folderId }) => {
  const [data, setData] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getFolderProgress(folderId, getAccessTokenSilently).then((data) => {
      setData(data);
    });
  }, [folderId, getAccessTokenSilently]);

  if (data == null) {
    return <IonItem lines="none">loading...</IonItem>;
  }
  return (
    <div>
      <PointLiner data={data} />
    </div>
  );
};

export default ProgressChart;
