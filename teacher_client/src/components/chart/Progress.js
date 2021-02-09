import { useEffect, useState } from "react";
import { getFolderProgress } from "../../services/api/index";
import { PointLiner } from "./drawing";

const ProgressChart = (item) => {
  const [data, setData] = useState(null);
  const folderId = item.data.id;
  const userName = item.data.name;
  // const { getAccessTokenSilently } = useAuth0();
  console.log("here");
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
