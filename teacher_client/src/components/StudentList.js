import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUsers } from "../services/api/index";

const StudentList = () => {
  const [studentList, setStudentList] = useState([]);
  const { userName } = useParams();
  useEffect(() => {
    (async () => {
      const data = await getUsers();
      setStudentList(data);
    })();
  }, []);
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
