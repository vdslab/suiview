import { useEffect, useState } from "react";
import { IonItem } from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import { getMusicDecibel } from "../../services/api";
import { Liner } from "./drawing";

const Decibel = ({ musicId }) => {
  const [data, setData] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getMusicDecibel(musicId, getAccessTokenSilently).then((data) => {
      setData(data);
    });
  }, [musicId, getAccessTokenSilently]);

  if (data == null) {
    return <IonItem lines="none">loading...</IonItem>;
  }
  return <Liner data={data.values} />;
};

export default Decibel;
