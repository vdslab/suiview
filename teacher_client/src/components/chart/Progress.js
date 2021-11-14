import { useEffect, useState } from "react";
import { getFolderProgress } from "../../services/api/index";
import { PointLiner } from "./drawing";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const ProgressChart = () => {
  const [data, setData] = useState(null);
  const { userName, folderId } = useParams();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getFolderProgress(userName, folderId, getAccessTokenSilently).then(
      (data) => {
        setData(data);
      }
    );
  }, [userName, folderId, getAccessTokenSilently]);

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
