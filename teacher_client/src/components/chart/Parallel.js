import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getFolderParallel } from "../../services/api";
import { ParallelCoordinates } from "./drawing";

const ParallelChart = (item) => {
  const [data, setData] = useState(null);
  const folderId = item.data.id;
  const userName = item.data.name;
  // const { getAccessTokenSilently } = useAuth0();
  console.log("here");
  useEffect(() => {
    getFolderParallel(userName, folderId).then((data) => {
      setData(data);
    });
  }, [folderId]);
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