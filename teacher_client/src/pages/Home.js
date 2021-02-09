import { useEffect, useState } from "react";
import FolderList from "../components/FolderList";
import StudentList from "../components/StudentList";
import Folder from "../components/Folder";
import { getUsers } from "../services/api/index";

function Home() {
  return (
    <div className="columns">
      <div className="column is-2">
        生徒
        <StudentList />
      </div>
      <div className="column is-2">
        フォルダー
        <FolderList />
      </div>
      <div className="column is-8">
        録音データ <Folder />
      </div>
    </div>
  );
}

export default Home;
