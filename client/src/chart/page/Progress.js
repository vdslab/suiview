import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IonItem } from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import { request } from "../../services";
import PointLiner from "../drawing/LinerWithPoint";

const ProgressChart = () => {
  const { foldername } = useParams();
  const [data, setData] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    request(
      ` ${process.env.REACT_APP_API_ENDPOINT}/1/musics/progress/${foldername}`,
      getAccessTokenSilently,
      getAccessTokenSilently,
    ).then((data) => {
      setData(data);
    });
  }, [foldername, getAccessTokenSilently]);

  if (data == null) {
    return (
      <IonItem>
        <div>loading...</div>
      </IonItem>
    );
  }
  return (
    <div>
      <PointLiner data={data} />
    </div>
  );
};

export default ProgressChart;
