import FolderList from "../components/FolderList";
import StudentList from "../components/StudentList";
import Folder from "../components/Folder";

function Home() {
  return (
    <div className="columns">
      <div className="column is-2 ">
        <StudentList />
      </div>
      <div className="column is-2">
        <h1
          className="has-text-weight-bold"
          style={{ textDecoration: "underline", paddingBottom: "0.5rem" }}
        >
          フォルダー
        </h1>
        <FolderList />
      </div>
      <div className="column is-8">
        <h1
          className="has-text-weight-bold"
          style={{ textDecoration: "underline", paddingBottom: "0.5rem" }}
        >
          録音データ
        </h1>{" "}
        <Folder />
      </div>
    </div>
  );
}

export default Home;
