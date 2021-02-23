import { useEffect, useState } from "react";
import { IonItem } from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import { getMusicF0 } from "../../services/api";
import { Liner } from "./drawing";

const ShowFrequency = ({ musicId }) => {
  const [data, setData] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getMusicF0(musicId, getAccessTokenSilently).then((data) => {
      setData(data);
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
      <IonItem lines="none">
        {" "}
        {/*安定度：{data.average} &ensp;*/}　安定度：{data.s}
      </IonItem>
      <Liner data={data.values} />
    </div>
  );
};

export default ShowFrequency;
