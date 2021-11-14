import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import FolderList from "../components/FolderList";
import StudentList from "../components/StudentList";
import Folder from "../components/Folder";
import { putUsername, getUsername } from "../services/api/";
import { useTranslation } from "react-i18next";

function Account() {
  const [userData, setUserData] = useState();
  const [reName, setRename] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    (async () => {
      const data = await getUsername(getAccessTokenSilently);
      setUserData(data);
    })();
  }, [getAccessTokenSilently]);

  async function sendNewName() {
    const name = document.getElementById("name").value;
    if (name === "") {
      alert("enterNewUserName");
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
          <div className="title is-5">{t("userName")}</div>
          <div className="columns">
            {/*<div className="column is-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" />
                <circle cx="12" cy="10" r="3" />
                <circle cx="12" cy="12" r="10" />
              </svg>
             </div>*/}
            <div className="column">
              {reName ? (
                <div className="columns">
                  <div className="column is-4">
                    <input
                      id="name"
                      className="input"
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
                      {t("save")}
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
                    {t("changeUserName")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="pt-6">
          <div className="title is-5">{t("changeLanguage")}</div>
          <div className="select is-small is-primary">
            <select
              value={i18n.language.slice(0, 2)}
              onChange={(event) => {
                i18n.changeLanguage(event.currentTarget.value);
              }}
            >
              <option value="ja">{t("japanese")}</option>
              <option value="en">{t("english")}</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}

function Home() {
  const { t } = useTranslation();
  const content = [t("home"), t("setting"), t("logout")];
  const [selected, setSelected] = useState();
  const { logout } = useAuth0();

  return (
    <div>
      <section className="hero  is-small has-background-primary">
        <div className="hero-body">
          <div className="container">
            <div className="columns">
              <h1 className="title column is-9">
                {t("title")}♪<span className="is-size-5"> {t("subtitle")}</span>
              </h1>
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
                {selected === t("logout")
                  ? logout({ returnTo: window.location.origin })
                  : []}
              </div>
            </div>
          </div>
        </div>
      </section>

      {selected === t("setting") ? (
        <Account />
      ) : (
        <div>
          <section
            className="section"
            style={{ paddingBottom: "0px", paddingTop: "24px" }}
          >
            {t("homeP1")}
            <br />
            {t("homeP2")} <br />
            {t("homeP3")}
          </section>
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
        </div>
      )}
    </div>
  );
}

export default Home;
