import { useEffect, useState } from "react";
//import { useAuth0 } from "@auth0/auth0-react";
import { ManyLiner } from "./drawing";
import { getFolderF0 } from "../../services/api";
import { useParams } from "react-router-dom";

const FrequencyChart = () => {
  const [data, setData] = useState(null);
  const { userName, folderId } = useParams();
  // const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    getFolderF0(userName, folderId).then((data) => {
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

export default FrequencyChart;
