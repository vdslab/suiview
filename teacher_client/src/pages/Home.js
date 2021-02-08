import { useEffect, useState } from "react";
import FolderList from "../components/FolderList";
import StudentList from "../components/StudentList";
import { getUsers } from "../services/api/index";

function Home() {
  return (
    <div className="columns">
      <div className="column is-2">
        生徒
        <StudentList />
      </div>
      <div className="column is-3">
        フォルダー
        <FolderList />
      </div>
      <div className="column is-7">Third column</div>
    </div>
  );
}

export default Home;
