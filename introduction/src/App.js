import img2 from "./images/ogp_t_b.png";
import qr_img from "./images/QR_b.jpg";
import imgh from "./images/ogp_half_b.png";

function App() {
  return (
    <div>
      <section className="hero-1 is-small">
        <div className="bg">
          <div className="hero-body">
            <div className="container" style={{ padding: "20px" }}>
              <div className="has-text-centered ">
                <h1 className="title has-text-white">
                  管楽器を対象とした基礎的演奏技向上のための
                  <br />
                  音響特徴可視化アプリの試作
                </h1>
                <h2 className="title is-6 has-text-white">
                  日本大学文理学部 渡邉みさと
                </h2>
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
            <div className="title is-5">概要</div>
            <p>
              管楽器は、発音そのものが簡単ではないため、音の強さ・高さ・音色が安定した音を出せるようになるための基礎的な反復トレーニングが不可欠である。
              しかし、初心者にとって、これらが安定しているかを音から判断するのは難しく、初心者が独力で練習する1つの障壁になっていた。
              本研究では、管楽器を練習したいユーザが気軽に録音し、音の強さ・高さ・音色の安定度を視覚的に確かめられるWebアプリ「吹view」の開発を進めている。
              これらの音響特徴をグラフ化するだけでなく、継続的に録音を行うことで、これらの音響特徴の安定度がどのように改善しているかを可視化する機能の実装も進めている。
              本発表では、本アプリのプロトタイプについてデモを交えて報告する。
            </p>
          </div>
        </section>
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
              また、先生モードからは登録したユーザの演奏データを見て、コメントをつけることができ、他者からの評価をもらうこともできます。
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
