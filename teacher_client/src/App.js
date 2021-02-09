import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";

function Header() {
  return (
    <section className="hero  is-small has-background-primary">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">musicvis</h1>
        </div>
      </div>
    </section>
  );
}

function RegistrationPage() {
  return <div>registration</div>;
}

function Footer() {
  return (
    <footer className="footer">
      <div className="content has-text-centered">(_ _)....</div>
    </footer>
  );
}

export function App() {
  return (
    <Router>
      <Header />
      <section className="section">
        <div className="container">
          <div className=""></div>
          <Switch>
            <Route path="/">
              <Home />
            </Route>
            <Route path="/:username/folder">
              <Home />
            </Route>
            <Route path="/:username/folder/:foldername">
              <Home />
            </Route>
            <Route path="/:username/folder/:foldername/:musicId">
              <Home />
            </Route>
            <Route path="/registration" exact>
              <RegistrationPage />
            </Route>
          </Switch>
        </div>
      </section>
      <Footer />
    </Router>
  );
}
export default App;
