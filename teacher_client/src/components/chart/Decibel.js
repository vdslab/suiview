import { useEffect, useState } from "react";
//import { useAuth0 } from "@auth0/auth0-react";
import { getMusicDecibel } from "../../services/api/music";
import { Liner } from "./drawing";
import { useParams } from "react-router-dom";

const Decibel = () => {
  const [data, setData] = useState(null);
  const { userName, musicId } = useParams();

  useEffect(() => {
    getMusicDecibel(userName, musicId).then((data) => {
      setData(data);
    });
  }, [musicId]);
  console.log(data);

  if (data == null) {
    return <div>loading...</div>;
  }
  return (
    <div>
      安定度：{data.average} &ensp; 標準偏差：{data.s}
      <Liner data={data.values} />
    </div>
  );
};

export default Decibel;
