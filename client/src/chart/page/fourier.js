import React from "react";
import { IonItem } from "@ionic/react";
import { useParams } from "react-router-dom";
import { useFetch_get } from "../root/index";
import Liner from "../drawing/liner";

const ShowFourier = () => {
  const { musicId } = useParams();
  const data = useFetch_get(
    `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/fourier`,
  );
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
      <Liner data={data} />
    </div>
  );
};

export default ShowFourier;
