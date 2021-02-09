import { useEffect, useState } from "react";
import { getFolderProgress } from "../../services/api/index";
import { PointLiner } from "./drawing";
import { useParams } from "react-router-dom";

const ProgressChart = () => {
  const [data, setData] = useState(null);
  const { userName, folderId } = useParams();

  // const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    getFolderProgress(userName, folderId).then((data) => {
      setData(data);
    });
  }, [folderId]);
  console.log(data);

  if (data == null) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <PointLiner data={data} />
    </div>
  );
};

export default ProgressChart;
