import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import { useAuth0 } from "@auth0/auth0-react";

function Header() {
  const { logout } = useAuth0();
  return (
    <section className="hero  is-small has-background-primary">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">musicvis</h1>
          <button
            slot="end"
            expand="full"
            color="light"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Log out
          </button>
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

function Login() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div>
      login
      <button onClick={loginWithRedirect}>login</button>
    </div>
  );
}

export function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <Router>
      {" "}
      <Header />
      {isAuthenticated ? (
        <div>
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
        <Login />
      )}{" "}
      <Footer />
    </Router>
  );
}
export default App;
