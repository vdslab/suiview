import { useEffect, useState } from "react";
import { getUsers } from "../services/api/index";

const StudentList = () => {
  const [studentList, setStudentList] = useState([]);
  useEffect(async () => {
    const data = await getUsers();
    setStudentList(data);
  }, []);
  console.log(studentList);

  return (
    <section>
      <ul>
        {studentList.map((d, key) => {
          return (
            <li key={key}>
              <a href={`http://localhost:3000/${d}/folder`}>{d}</a>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default StudentList;
