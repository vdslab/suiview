import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";

function Login() {
  const { loginWithRedirect } = useAuth0();
  const { t, i18n } = useTranslation();

  return (
    <div>
      <section className="hero  is-small has-background-primary">
        <div className="hero-body">
          <div
            className="container"
            style={{
              padding: "40px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h1 className="title  has-text-centered">
              {t("title")}♪<span className="is-size-5"> {t("subtitle")}</span>
            </h1>
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
        </div>
      </section>
      <section className="hero">
        <div className="hero-body">
          <div className="has-text-centered">
            <section>
              <h2 className="title is-5">{t("aboutSuiview")}</h2>
              <p>
                {t("loginPage1")} {t("loginPage2")}
              </p>
              <br />
              <h2 className="title is-5">{t("whatYouCanDo")}</h2>
              <p>{t("loginPage3")}</p>
            </section>
            <section className="section">
              <button
                onClick={loginWithRedirect}
                className="button is-primary is-outlined"
              >
                {t("login")}
              </button>
            </section>
          </div>
        </div>
      </section>
    </div>
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
            <Route path="/:userName/folder/:folderId/:musicId" exact>
              <Home />
            </Route>
          </Switch>
        </div>
      ) : (
        <Login />
      )}{" "}
    </Router>
  );
}
export default App;
