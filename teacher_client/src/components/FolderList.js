import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getFolders } from "../services/api/index";

const FolderList = () => {
  const [folders, setFolders] = useState();
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
          return (
            <li key={data.id}>
              <a href={`http://localhost:3000/${username}/folder/${data.name}`}>
                {data.name}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default FolderList;
