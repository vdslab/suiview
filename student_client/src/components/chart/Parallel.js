import { useEffect, useState } from "react";
import { IonItem } from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import { getFolderParallel } from "../../services/api";
//import { ParallelCoordinates } from "./drawing";
import { Bar } from "./drawing";

const ParallelChart = ({ folderId }) => {
  const [data, setData] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getFolderParallel(folderId, getAccessTokenSilently).then((data) => {
      setData(data);
    });
  }, [folderId, getAccessTokenSilently]);

  if (data == null) {
    return (
      <IonItem>
        <div>loading...</div>
      </IonItem>
    );
  }
  return (
    <div>
      <IonItem lines="none">　最大直近10個のデータです</IonItem>
      {/*<ParallelCoordinates data={data} />*/}
      <Bar data={data} />
    </div>
  );
};

export default ParallelChart;
