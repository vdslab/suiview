import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import { useAuth0 } from "@auth0/auth0-react";
import img from "./images/ogp_h.png";
import qr_img from "./images/QR_y.png";

function Login() {
  const { loginWithRedirect } = useAuth0();
  return (
    <div>
      <section className="hero  is-small has-background-primary">
        <div className="hero-body">
          <div className="container" style={{ padding: "40px" }}>
            <h1 className="title  has-text-centered">
              吹View♪<span className="is-size-5">-先生モード-</span>
            </h1>
          </div>
        </div>
      </section>
      <section className="hero">
        <div className="hero-body">
          <div className="has-text-centered">
            <section>
              <h2 className="title is-5">吹viewとは</h2>
              <p>
                管楽器の練習を始めたばかりの初心者が安定した音を出せるようにするためのお手伝いをするアプリです。
                管楽器を練習したいユーザが気軽に録音し,音の強さ・高さ・音色の安定度を視覚的に確かめることができます。
              </p>
              <br />
              <h2 className="title is-5">先生モードでできること</h2>
              <p>
                先生モードでは生徒が演奏した音源とグラフを見てコメントを付けることができます。
                付けたコメントは生徒が見ることができます。
              </p>
            </section>
            <section className="section">
              <button
                onClick={loginWithRedirect}
                className="button is-primary is-outlined"
              >
                login
              </button>
            </section>
            <section>
              <h2 className="title is-6">
                生徒モードはこちら↓スマートフォン推奨
              </h2>
              <a href="https://suiview-s.vdslab.jp/">
                <img
                  src={img}
                  alt="先生モード"
                  style={{ width: "25vmin", margin: "0.5rem" }}
                />
              </a>
              <img
                src={qr_img}
                alt="先生モード"
                style={{ width: "25vmin", margin: "0.5rem" }}
              />
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
