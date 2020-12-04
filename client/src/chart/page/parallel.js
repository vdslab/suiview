import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IonItem } from "@ionic/react";
import { request } from "../../serviceWorker/index";
import { useAuth0 } from "@auth0/auth0-react";
import ParallelCoordinates from "../drawing/parallel";

const ParallelChart = () => {
  console.log("here");

  const { foldername } = useParams();
  const [data, setData] = useState();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    request(
      ` ${process.env.REACT_APP_API_ENDPOINT}/1/musics/parallel/${foldername}`,
      getAccessTokenSilently
    ).then((data) => {
      setData(data);
    });
  }, []);
  console.log(data);

  if (data == undefined) {
    return (
      <IonItem>
        <div>loading...</div>
      </IonItem>
    );
  }
  return (
    <div>
      <IonItem lines="none">　最大直近10個のデータです</IonItem>
      <ParallelCoordinates data={data} />
    </div>
  );
};

export default ParallelChart;
