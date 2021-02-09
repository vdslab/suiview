import { useEffect, useState } from "react";
//import { useAuth0 } from "@auth0/auth0-react";
import { getFolderDecibel } from "../../services/api";
import { ManyLiner } from "./drawing";
import { useParams } from "react-router-dom";

const VolumeChart = () => {
  const [data, setData] = useState(null);
  const { userName, folderId } = useParams();

  // const { getAccessTokenSilently } = useAuth0();
  console.log("here");
  useEffect(() => {
    getFolderDecibel(userName, folderId).then((data) => {
      setData(data);
    });
  }, [userName, folderId]);
  console.log(data);

  if (data == null) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <ManyLiner data={data} />
    </div>
  );
};

export default VolumeChart;
