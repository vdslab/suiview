import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IonItem } from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import { request } from "../../services";
import { ManyLiner } from "./drawing";

const Centroid_Rolloff = () => {
  const { musicId } = useParams();
  const [ave, setAve] = useState();
  const [data, setData] = useState(null);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    request(
      `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/spectrum_centroid&rolloff`,
      getAccessTokenSilently,
    ).then((data) => {
      setData(data);
    });
  }, [musicId, getAccessTokenSilently]);

  useEffect(() => {
    request(
      `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/rolloff_ave`,
      getAccessTokenSilently,
    ).then((data) => {
      setAve(data);
    });
  }, [musicId, getAccessTokenSilently]);

  if (data == null) {
    return (
      <IonItem>
        <div>loading...</div>
      </IonItem>
    );
  }
  return (
    <div>
      <IonItem lines="none"> 安定度... {ave}</IonItem>
      <ManyLiner data={data} />
    </div>
  );
};

export default Centroid_Rolloff;
