import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import FolderList from "../components/FolderList";
import StudentList from "../components/StudentList";
import Folder from "../components/Folder";
import { putUsername, getUsername } from "../services/api/";

function Account() {
  const [userData, setUserData] = useState();
  const [reName, setRename] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    (async () => {
      const data = await getUsername(getAccessTokenSilently);
      setUserData(data);
    })();
  }, [getAccessTokenSilently]);

  async function sendNewName() {
    const name = document.getElementById("name").value;
    if (name === "") {
      alert("入力してください");
      return;
    }
    putUsername({ name }, getAccessTokenSilently);
    setRename(false);
    const data = await getUsername(getAccessTokenSilently);
    setUserData(data);
  }

  return (
    <div>
      {" "}
      <section className="section">
        <div className="container">
          ユーザー情報
          {reName ? (
            <div className="columns">
              <div className="column is-4">
                <input
                  id="name"
                  class="input"
                  type="text"
                  placeholder={userData?.name}
                ></input>
              </div>
              <div className="column is-8">
                <button
                  className="button is-small"
                  onClick={() => {
                    sendNewName();
                  }}
                >
                  保存する
                </button>
              </div>
            </div>
          ) : (
            <div className="column is-6">
              {userData?.name} &ensp;
              <button
                onClick={() => setRename(true)}
                className="button is-small"
              >
                ユーザー名を変更する
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Home() {
  const content = ["ホーム", "アカウント", "ログアウト"];
  const [selected, setSelected] = useState();
  const { logout } = useAuth0();

  return (
    <div>
      <section className="hero  is-small has-background-primary">
        <div className="hero-body">
          <div className="container">
            <div className="columns">
              <h1 className="title column is-9">musicvis</h1>
              <div className="column is-3">
                <div className="select is-small is-primary">
                  <select
                    name="pets"
                    id="pet-select"
                    onChange={(e) => setSelected(e.currentTarget.value)}
                  >
                    {content.map((item, id) => {
                      return (
                        <option value={item} key={id}>
                          {item}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {selected === "ログアウト"
                  ? logout({ returnTo: window.location.origin })
                  : []}
              </div>
            </div>
          </div>
        </div>
      </section>

      {selected === "アカウント" ? (
        <Account />
      ) : (
        <section className="section">
          <div className="container">
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
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
