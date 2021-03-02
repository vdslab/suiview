import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import { useAuth0 } from "@auth0/auth0-react";

function Login() {
  const { loginWithRedirect } = useAuth0();
  return (
    <div>
      <section className="hero  is-small has-background-primary">
        <div className="hero-body">
          <div className="container">
            <div className="columns">
              <h1 className="title column is-9">吹View♪</h1>
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
      ) : (
        <Login />
      )}{" "}
      <Footer />
    </Router>
  );
}
export default App;
