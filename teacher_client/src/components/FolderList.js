import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getFolders } from "../services/api/index";
/*import { useAuth0 } from "@auth0/auth0-react";
import { getFolders, deleteFolder, postFolder } from "../services/api";
import argImg from "../images/arpeggio.PNG";
import longtoneImg from "../images/longtone.PNG";
import scaleImg from "../images/scale.PNG";
export const defoFolder = [
  { img: longtoneImg, name: "ロングトーン" },
  { img: scaleImg, name: "スケール" },
  { img: argImg, name: "アルペジオ" },
];*/
const FolderList = () => {
  const [folders, setFolders] = useState();
  //const username = useParams("username");
  const path = location.pathname.split("/");
  console.log(path);
  const username = path[1];
  console.log(username);

  useEffect(async () => {
    const data = await getFolders(username);
    setFolders(data);
  }, []);
  console.log(folders);

  return (
    <section>
      <ul>
        {folders?.map((data) => {
          <li key={data.id}>
            <a>{data.name}</a>
          </li>;
        })}
      </ul>
    </section>
  );
};

export default FolderList;
