import { useEffect, useState } from "react";
//import { useAuth0 } from "@auth0/auth0-react";
import { getMusicF0 } from "../../services/api";
import { Liner } from "./drawing";

const ShowFrequency = ({ musicId }) => {
  const [data, setData] = useState(null);
  const folderId = item.data.id;
  const userName = item.data.name;
  // const { getAccessTokenSilently } = useAuth0();
  console.log("here");

  if (data == null) {
    return <div>loading...</div>;
  }
  return (
    <div>
      {" "}
      安定度：{data.average} &ensp;　標準偏差：{data.s}
      <Liner data={data.values} />
    </div>
  );
};

export default ShowFrequency;
