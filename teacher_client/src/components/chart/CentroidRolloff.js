import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  getMusicSpectrumCentroid,
  getMusicSpectrumRolloff,
} from "../../services/api";
import { ManyLiner } from "./drawing";
import { useParams } from "react-router-dom";

const CentroidRolloff = () => {
  const { userName, musicId } = useParams();
  const [ave, setAve] = useState();
  const [data, setData] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const centroidRequest = getMusicSpectrumCentroid(
      userName,
      musicId,
      getAccessTokenSilently
    );
    const rolloffRequest = getMusicSpectrumRolloff(
      userName,
      musicId,
      getAccessTokenSilently
    );
    Promise.all([centroidRequest, rolloffRequest]).then(
      ([centroid, rolloff]) => {
        setAve(rolloff.average);
        setData([
          { id: "centroid", data: centroid.values },
          { id: "rolloff", data: rolloff.values },
        ]);
      }
    );
  }, [userName, musicId, getAccessTokenSilently]);

  if (data == null) {
    return <div>loading...</div>;
  }
  return (
    <div>
      安定度：{ave.stability} &ensp; 標準偏差：{ave.s}
      <ManyLiner data={data} />
    </div>
  );
};

export default CentroidRolloff;
