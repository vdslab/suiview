import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { putUsername, getUsername } from "./services/api/";

function LoginHeader() {
  const { loginWithRedirect } = useAuth0();
  return <button onClick={loginWithRedirect}>login</button>;
}

function LogoutHeader() {
  const { logout } = useAuth0();
  const { getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState();
  const [reName, setRename] = useState(false);

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
    <div className="columns">
      {reName === false ? (
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
      )}
      <div className="column is-6">
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log out
        </button>
      </div>
    </div>
  );
}

function Header(data) {
  const login = data.login;

  return (
    <section className="hero  is-small has-background-primary">
      <div className="hero-body">
        <div className="container">
          <div className="columns">
            <h1 className="title column is-9">musicvis</h1>
            <div className="column is-3">
              {login ? <LogoutHeader /> : <LoginHeader />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
          <Header login={true} />
          <section className="section">
            <div className="container">
              <div className=""></div>
              <Switch>
                <Route path="/" exact>
                  <Home />
                </Route>
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
          </section>
        </div>
      ) : (
        <Header login={false} />
      )}{" "}
      <Footer />
    </Router>
  );
}
export default App;
