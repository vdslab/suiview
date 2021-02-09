import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getFolderDecibel } from "../../services/api";
import { ManyLiner } from "./drawing";

const VolumeChart = ({ folderId }) => {
  const [data, setData] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getFolderDecibel(folderId, getAccessTokenSilently).then((data) => {
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
      <ManyLiner data={data} />
    </div>
  );
};

export default VolumeChart;
