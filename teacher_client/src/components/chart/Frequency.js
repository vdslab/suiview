import { useEffect, useState } from "react";
//import { useAuth0 } from "@auth0/auth0-react";
import { getMusicF0 } from "../../services/api/music";
import { Liner } from "./drawing";
import { useParams } from "react-router-dom";

const ShowFrequency = () => {
  const [data, setData] = useState(null);
  const { userName, musicId } = useParams();

  // const { getAccessTokenSilently } = useAuth0();
  /* useEffect(() => {
    getMusicF0(musicId, getAccessTokenSilently).then((data) => {
      setData(data);
    });
  }, [musicId, getAccessTokenSilently]);*/
  useEffect(() => {
    getMusicF0(userName, musicId).then((data) => {
      setData(data);
    });
  }, [userName, musicId]);

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
