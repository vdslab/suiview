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
            <p>ooooooooooooooooxxxxxxxxxxxxxxxxxxxxxxxxxxxoxoxoxoxoxoxo</p>
            <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
            <p>oxoxoxoxoxoxoxoxoxoox</p>{" "}
          </div>
        </section>

        <div className="columns">
          <div className="column has-text-centered section">
            <a href="https://musicvis.vdslab.jp/">
              <img src={img} alt="イメージ画像" className="images" />
            </a>
            <div className="title is-6">生徒モード</div>
            <p>xxxxxxxxxxxxxxxxxxxxxx</p>
            <p>oxoxoxoxoxoxoxoxoxo</p>
          </div>

          <div className="column has-text-centered section">
            <a href="https://musicvis-t.vdslab.jp/">
              <img src={img} alt="イメージ画像" className="images" />
            </a>
            <div className="title is-6">先生モード</div>
            <p>xxxxxxxxxxxxxxxxxxxxxx</p>
            <p>oxoxoxoxoxoxoxoxoxo</p>
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
