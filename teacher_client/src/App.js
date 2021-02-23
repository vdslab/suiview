import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import { useAuth0 } from "@auth0/auth0-react";
//import { useState, useEffect } from "react";
//import { putUsername, getUsername } from "./services/api/";

function Login() {
  const { loginWithRedirect } = useAuth0();
  return (
    <div>
      <section className="hero  is-small has-background-primary">
        <div className="hero-body">
          <div className="container">
            <div className="columns">
              <h1 className="title column is-9">musicvis</h1>
              <div className="column is-3"></div>
            </div>
          </div>
        </div>
      </section>
      <section className="hero">
        <div className="hero-body">
          <div className="has-text-centered">
            <section>説明とか</section>
            <br />
            <button onClick={loginWithRedirect} className="button">
              login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/*
function LogoutHeader() {
  const { logout } = useAuth0();
  const { getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState();
  const [reName, setRename] = useState(false);
  const content = ["-", "アカウント", "ログアウト"];
  const [selected, setSelected] = useState();

  useEffect(() => {
    (async () => {
      const data = await getUsername(getAccessTokenSilently);
      setUserData(data);
    })();
  }, [getAccessTokenSilently]);

  async function sendNewName() {
    const name = document.getElementById("name").value;
    putUsername({ name }, getAccessTokenSilently);
    setRename(false);
    const data = await getUsername(getAccessTokenSilently);
    setUserData(data);
  }

  return (
    <div>
      <div className="columns">
        <div className="select is-small">
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
        {/*reName === false ? (
        <div>
          <div className="column is-6">{userData?.name}</div>
          <button onClick={() => setRename(true)}>ユーザー名を変更する</button>
        </div>
      ) : (
        <div className="column is-6">
          <input
            type="text"
            id="name"
            name="name"
            required
            minlength="4"
            maxlength="8"
            size="10"
          />
          <button
            onClick={() => {
              sendNewName();
            }}
          >
            これでOK！
          </button>
        </div>
          )
    </div>
  );
}
*/
function Footer() {
  return (
    <footer className="footer">
      <div className="content has-text-centered">(_ _)....</div>
    </footer>
  );
}

export function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <Router>
      {" "}
      {isAuthenticated ? (
        <div>
          {/*<Header login={true} />*/}
          {/*} <section className="section">
            <div className="container">
      <div className=""></div>*/}
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            {/*} <Route path="/account" exact>
              <Account />
    </Route>*/}
            <Route path="/:userName/folder" exact>
              <Home />
            </Route>
            <Route path="/:userName/folder/:folderId" exact>
              <Home />
            </Route>
            <Route path="/:userName/folder/:folderId/:musicId">
              <Home />
            </Route>
          </Switch>
        </div>
      ) : (
        /* </section>
        </div>*/
        <Login />
      )}{" "}
      <Footer />
    </Router>
  );
}
export default App;
