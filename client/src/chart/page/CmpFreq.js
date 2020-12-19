import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IonItem } from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import ManyLiner from "../drawing/ManyLines";
import { request } from "../../services";

const FrequencyChart = () => {
  const { foldername } = useParams();
  const [data, setData] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    request(
      ` ${process.env.REACT_APP_API_ENDPOINT}/1/musics/folder_freq_compare/${foldername}`,
      getAccessTokenSilently,
    ).then((data) => {
      setData(data);
    });
  }, [foldername, getAccessTokenSilently]);
  console.log(data);

  if (data == null) {
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

export default FrequencyChart;
