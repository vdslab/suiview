import img2 from "./images/ogp_t.png";
import qr_img from "./images/QR_b.jpg";
import imgh from "./images/ogp_half.png";

function App() {
  return (
    <div>
      <section className="hero-1 is-small">
        <div className="bg">
          <div className="hero-body">
            <div className="container" style={{ padding: "20px" }}>
              <div className="has-text-centered ">
                <h1 className="title is-2 ">吹 v i ew</h1>
                <h2 className="title is-6 ">
                  管楽器を対象とした基礎的演奏技向上のための
                  <br />
                  音響特徴可視化アプリの試作
                </h2>
                <h3 className="title is-6 ">
                  日本大学文理学部 渡邉 尾上 北原 植村
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hero">
        <section
          className="section"
          style={{ paddingLeft: "56px", paddingRight: "56px" }}
        >
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
              また、先生モードからは登録したユーザの演奏データを見てコメントをつけることができ、他者からの評価をもらうこともできます。
            </p>{" "}
          </div>
        </section>

        <div className="columns">
          <div
            className="column has-text-centered section"
            style={{ paddingLeft: "56px", paddingRight: "56px" }}
          >
            <div className="title is-6">生徒モード</div>
            <p>
              ユーザーが演奏を録音すると、高さ・強さ・音色の3観点からどの程度演奏が安定しているかを点数とグラフから知ることができます。
            </p>
            <p>
              また、演奏データを蓄積していくことで安定度の推移がわかります。
            </p>
            <p className="here">こちらから↓スマートフォン推奨</p>
            <div style={{ margin: "1rem" }}>
              <a href="https://suiview-s.vdslab.jp">
                <img src={imgh} alt="イメージ画像" className="images_h" />
              </a>
              <img src={qr_img} alt="イメージ画像" className="images_h" />
            </div>
          </div>

          <div
            className="column has-text-centered section"
            style={{ paddingLeft: "56px", paddingRight: "56px" }}
          >
            <div className="title is-6">先生モード</div>
            <p>
              先生モードでは生徒が演奏した音源とグラフを見てコメントを付けることができます。
            </p>
            <p>付けたコメントは生徒が見ることができます。</p>
            <p className="here">こちらから↓PC・タブレット推奨</p>

            <div style={{ margin: "1rem" }}>
              <a href="https://suiview-t.vdslab.jp/">
                <img src={img2} alt="イメージ画像" className="images" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
