import { useEffect, useState } from "react";
import { getFolders } from "../services/api/index";

const FolderList = () => {
  const [folders, setFolders] = useState();
  const path = location.pathname.split("/");
  const userName = path[1];

  useEffect(async () => {
    console.log(userName);
    if (userName !== undefined && userName !== "") {
      const data = await getFolders(userName);
      setFolders(data);
    }
  }, []);
  console.log(folders);

  return (
    <section>
      <ul>
        {folders?.map((data) => {
          return (
            <li key={data.id}>
              <a href={`/${userName}/folder/${data.id}`}>{data.name}</a>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default FolderList;
