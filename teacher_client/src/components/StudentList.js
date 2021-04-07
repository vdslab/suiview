import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUsers, postStudentsList } from "../services/api/index";
import { useAuth0 } from "@auth0/auth0-react";

const StudentList = () => {
  const [studentList, setStudentList] = useState([]);
  const { userName } = useParams();
  const { getAccessTokenSilently } = useAuth0();

  async function Registration(studentId) {
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

  return (
    <section>
      <h1
        className="has-text-weight-bold"
        style={{ textDecoration: "underline", paddingBottom: "0.5rem" }}
      >
        生徒
      </h1>

      <ul>
        {studentList.map((d, key) => {
          return (
            <li key={key}>
              <Link
                to={`/${d[0]}/folder`}
                className={
                  d[0].replace("%", "|") !== userName
                    ? "has-text-black"
                    : "has-text-blue"
                }
              >
                {d[1]}
              </Link>
            </li>
          );
        })}
      </ul>
      <div style={{ paddingTop: "0.25rem" }}>
        <button
          className="button is-outlined is-primary is-rounded is-small"
          onClick={() => {
            const studentId = prompt("生徒のIDを入力してください");
            Registration(studentId);
          }}
        >
          生徒の追加
        </button>
      </div>
    </section>
  );
};

export default StudentList;
