import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IonItem } from "@ionic/react";
import ManyLiner from "../drawing/many_lines";
import { request } from "../../serviceWorker/index";
import { useAuth0 } from "@auth0/auth0-react";

const ToneChart = () => {
  const { foldername } = useParams();
  const [data, setData] = useState();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    request(
      ` ${process.env.REACT_APP_API_ENDPOINT}/1/musics/folder_comp_tone/${foldername}`,
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
      <ManyLiner data={data} />
    </div>
  );
};

export default ToneChart;
