import { useEffect, useState } from "react";
//import { useAuth0 } from "@auth0/auth0-react";
import { getFolderParallel } from "../../services/api";
import { ParallelCoordinates } from "./drawing";
import { useParams } from "react-router-dom";

const ParallelChart = () => {
  const [data, setData] = useState(null);
  const { userName, folderId } = useParams();

  // const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getFolderParallel(userName, folderId).then((data) => {
      setData(data);
    });
  }, [userName, folderId]);
  console.log(data);

  if (data == null) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <div lines="none">　最大直近10個のデータです</div>
      <ParallelCoordinates data={data} />
    </div>
  );
};

export default ParallelChart;
