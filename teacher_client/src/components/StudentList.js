import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUsers } from "../services/api/index";
import { useAuth0 } from "@auth0/auth0-react";

const StudentList = () => {
  const [studentList, setStudentList] = useState([]);
  const { userName } = useParams();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    (async () => {
      const data = await getUsers(getAccessTokenSilently);
      setStudentList(data);
    })();
  }, [getAccessTokenSilently]);
  console.log(studentList);

  return (
    <section>
      <ul>
        {studentList.map((d, key) => {
          return (
            <li key={key}>
              {/*}  <a href={`/${d}/folder`}>{d}</a>*/}

              <Link
                to={`/${d}/folder`}
                className={d !== userName ? "has-text-black" : "has-text-blue"}
              >
                {d}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default StudentList;
