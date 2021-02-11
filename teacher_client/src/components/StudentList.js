import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUsers, postStudentsList } from "../services/api/index";
import { useAuth0 } from "@auth0/auth0-react";

const StudentList = () => {
  const [studentList, setStudentList] = useState([]);
  const { userName } = useParams();
  const { getAccessTokenSilently } = useAuth0();

  async function Registration(studentId) {
    console.log(studentId);
    if (studentId !== "") {
      const data = await postStudentsList(studentId, getAccessTokenSilently);
      setStudentList(data);
    }
  }

  useEffect(() => {
    (async () => {
      const data = await getUsers(getAccessTokenSilently);
      setStudentList(data);
    })();
  }, [getAccessTokenSilently]);
  console.log(studentList);

  return (
    <section>
      <div className="columns">
        <div className="column">
          <h1
            className="has-text-weight-bold"
            style={{ textDecoration: "underline", paddingBottom: "0.5rem" }}
          >
            生徒
          </h1>
        </div>
        <div className="column">
          <button
            onClick={() => {
              const studentId = prompt("生徒のIDを入力してください");
              Registration(studentId);
            }}
          >
            +
          </button>
        </div>
      </div>
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
