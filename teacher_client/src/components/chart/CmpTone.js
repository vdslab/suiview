import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getFolderTone } from "../../services/api";
import { ManyLiner } from "./drawing";

const ToneChart = (item) => {
  const [data, setData] = useState(null);
  const folderId = item.data.id;
  const userName = item.data.name;
  // const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    getFolderTone(userName, folderId).then((data) => {
      setData(data);
    });
  }, [folderId]);
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

export default ToneChart;
