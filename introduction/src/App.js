import img from "./images/gray.png";

function App() {
  return (
    <div>
      <section className="hero  is-small has-background-primary">
        <div className="hero-body">
          <div className="container">
            <div className="columns">
              <h1 className="title column is-9">吹View 紹介ページ</h1>
              <div className="column is-3"></div>
            </div>
          </div>
        </div>
      </section>
      <section className="hero">
        <section className="section">
          <div className="has-text-centered">
            <div className="title is-5">吹viewとは</div>
            <p>
              管楽器の練習を始めたばかりの初心者が安定した音を出せるようにするためのお手伝いをするアプリです。
            </p>
            <p>
              管楽器を練習したいユーザが気軽に録音
              し,音の強さ・高さ・音色の安定度を視覚的に確かめることができます。
            </p>
            <p>
              また、先生モードからは登録したユーザの演奏データを見て、コメントをつけることができ、他者からの評価をもらうこともできます。
            </p>{" "}
          </div>
        </section>

        <div className="columns">
          <div className="column has-text-centered section">
            <a href="https://suiview-s.vdslab.jp">
              <img src={img} alt="イメージ画像" className="images" />
            </a>
            <div className="title is-6">生徒モード</div>
            <p>
              ユーザーが演奏を録音すると、高さ・強さ・音色の3観点からどの程度演奏が安定しているかを点数とグラフから知ることができます。
            </p>
            <p>
              また、演奏データを蓄積していくことで安定度の推移がわかります。
            </p>
          </div>

          <div className="column has-text-centered section">
            <a href="https://suiview-t.vdslab.jp/">
              <img src={img} alt="イメージ画像" className="images" />
            </a>
            <div className="title is-6">先生モード</div>
            <p>
              先生モードでは生徒が演奏した音源とグラフを見てコメントを付けることができます。
            </p>
            <p>付けたコメントは生徒が見ることができます。</p>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="content has-text-centered">@xxxxxx</div>
      </footer>
    </div>
  );
}

export default App;
