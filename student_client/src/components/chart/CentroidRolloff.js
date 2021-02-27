import { useEffect, useState } from "react";
import { IonItem } from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  getMusicSpectrumCentroid,
  getMusicSpectrumRolloff,
} from "../../services/api";
import { ManyLiner } from "./drawing";

const CentroidRolloff = ({ musicId }) => {
  const [data, setData] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const centroidRequest = getMusicSpectrumCentroid(
      musicId,
      getAccessTokenSilently
    );
    const rolloffRequest = getMusicSpectrumRolloff(
      musicId,
      getAccessTokenSilently
    );
    Promise.all([centroidRequest, rolloffRequest]).then(
      ([centroid, rolloff]) => {
        setData([
          { id: "centroid", data: centroid.values },
          { id: "rolloff", data: rolloff.values },
        ]);
      }
    );
  }, [musicId, getAccessTokenSilently]);

  if (data == null) {
    return (
      <IonItem>
        <div>loading...</div>
      </IonItem>
    );
  }
  return <ManyLiner data={data} />;
};

export default CentroidRolloff;
