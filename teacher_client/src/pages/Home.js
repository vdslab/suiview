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
        <FolderList />
      </div>
      <div className="column is-8">
        <Folder />
      </div>
    </div>
  );
}

export default Home;
