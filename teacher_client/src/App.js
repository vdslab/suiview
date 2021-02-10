import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import { useAuth0 } from "@auth0/auth0-react";

function Header(data) {
  const { logout, loginWithRedirect } = useAuth0();
  const login = data.login;
  return (
    <section className="hero  is-small has-background-primary">
      <div className="hero-body">
        <div className="container">
          <div className="columns">
            <h1 className="title column is-9">musicvis</h1>
            <div className="column is-3">
              {login ? (
                <div className="columns">
                  <div className="column is-6">user name</div>
                  <div className="column is-6">
                    <button
                      slot="end"
                      expand="full"
                      color="light"
                      onClick={() =>
                        logout({ returnTo: window.location.origin })
                      }
                    >
                      Log out
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={loginWithRedirect}>login</button>
              )}
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
