import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IonItem } from "@ionic/react";
import Liner from "../drawing/liner";
import { request } from "../../serviceWorker/index";
import { useAuth0 } from "@auth0/auth0-react";

const ShowFrequency = () => {
  const { musicId } = useParams();
  const [ave, setAve] = useState();
  const [data, setData] = useState();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    request(
      `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/frequency/ave`,
      getAccessTokenSilently
    ).then((data) => {
      setAve(data);
    });
  }, []);

  useEffect(() => {
    request(
      `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/frequency`,
      getAccessTokenSilently
    ).then((data) => {
      setData(data);
    });
  }, []);

  console.log(data);

  /*if (data == undefined) {
    return (
      <IonItem>
        <div>loading...</div>
      </IonItem>
    );
  }*/
  return (
    <div>
      <IonItem lines="none"> 安定度... {ave}</IonItem>
      {data != undefined ? (
        <Liner data={data} />
      ) : (
        <IonItem>loading...</IonItem>
      )}
    </div>
  );
};

export default ShowFrequency;
