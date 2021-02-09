import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getFolders } from "../services/api/index";

const FolderList = () => {
  const [folders, setFolders] = useState();
  const { userName } = useParams(undefined);
  console.log(userName);

  useEffect(() => {
    (async () => {
      if (userName !== undefined && userName !== "") {
        const data = await getFolders(userName);
        setFolders(data);
      }
    })();
  }, [userName]);
  console.log(folders);

  return (
    <section>
      <ul>
        {folders?.map((data) => {
          return (
            <li key={data.id}>
              <Link to={`/${userName}/folder/${data.id}`}>{data.name}</Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default FolderList;
