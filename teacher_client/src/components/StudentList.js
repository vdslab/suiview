import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "../services/api/index";

const StudentList = () => {
  const [studentList, setStudentList] = useState([]);
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
              <Link to={`/${d}/folder`}>{d}</Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default StudentList;
