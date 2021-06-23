import { useEffect, useState } from "react";
import { IonItem } from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  getMusicSpectrumCentroid,
  getMusicSpectrumRolloff,
} from "../../services/api";
import { ToneLiner } from "./drawing";
import { Liner } from "./drawing";

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
    /*Promise.all([centroidRequest, rolloffRequest]).then(
      ([centroid, rolloff]) => {
        setData([
          { id: "centroid", data: centroid.values },
          { id: "rolloff", data: rolloff.values },
        ]);
      }
    );*/
    Promise.all([rolloffRequest]).then(([rolloff]) => {
      setData(rolloff);
    });
  }, [musicId, getAccessTokenSilently]);

  if (data == null) {
    return <IonItem lines="none">loading...</IonItem>;
  }
  // return <ToneLiner data={data} axis_name={""} />;
  return <Liner data={data.values} axis_name={"周波数"} />;
};

export default CentroidRolloff;
