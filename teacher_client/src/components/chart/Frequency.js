import { useEffect, useState } from "react";
//import { useAuth0 } from "@auth0/auth0-react";
import { getMusicF0 } from "../../services/api/music";
import { Liner } from "./drawing";

const ShowFrequency = () => {
  const [data, setData] = useState(null);
  const path = decodeURI(location.pathname).split("/");
  const userName = path[1];
  const musicId = path[4];
  // const { getAccessTokenSilently } = useAuth0();
  /* useEffect(() => {
    getMusicF0(musicId, getAccessTokenSilently).then((data) => {
      setData(data);
    });
  }, [musicId, getAccessTokenSilently]);*/
  useEffect(() => {
    console.log("AAA");
    getMusicF0(userName, musicId).then((data) => {
      setData(data);
    });
  }, [musicId]);
  console.log(data);

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
