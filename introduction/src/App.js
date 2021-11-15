import ogp_s from "./img/ogp_s.png";
import ogp_t_sp from "./img/ogp_t_sp.png";
import ogp_t from "./img/ogp_t.png";

import p1 from "./img/sameSize/p1.PNG";
import p2 from "./img/sameSize/p2.PNG";
import p3 from "./img/sameSize/p3.PNG";
import p4 from "./img/sameSize/p4.PNG";
/*import p1 from "./img/p1.png";
import p2 from "./img/p2.png";
import p3 from "./img/p3.png";
import p4 from "./img/p4.png";*/
import qr from "./img/QR.jpg";
import teacher from "./img/teacher.png";
import "./ress.css";
import "./style.css";
import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();
  return (
    <div>
      <header>
        <section className="hero">
          <div className="hero-body">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p className="title is-1">{t("title")}</p>

              <div
                className="select is-small "
                style={{ marginTop: "1.25rem" }}
              >
                <select
                  required
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
            <p className="subtitle">
              {t("subtitle1")}
              <br className="br-sp" />
              {t("subtitle2")}
            </p>
          </div>
        </section>
      </header>
      <div className="description">
        <h3>{t("aboutSuiview")}</h3>
        <div>
          <p>
            {t("aboutSuiview1_1")}
            <br className="br-sp" />
            {t("aboutSuiview1_2")}
            <br className="br-sp" />
            {t("aboutSuiview1_3")}
            <br />
            {t("aboutSuiview2_1")}
            <br className="br-sp" />
            {t("aboutSuiview2_2")}
            <br className="br-sp" />
            {t("aboutSuiview2_3")}
            <br />
            {t("aboutSuiview3_1")}
            <br className="br-sp" />
            {t("aboutSuiview3_2")}
            <br className="br-sp" />
            {t("aboutSuiview3_3")}
          </p>
        </div>
      </div>
      <div className="student">
        <div className="studentTitle">
          <h2 className="student">{t("studentMode")}</h2>
        </div>
        <p className="student">
          {t("studentMode1_1")}
          <br className="br-sp" />
          {t("studentMode1_2")}
          <br />
          {t("studentMode1_3")}
          <br className="br-sp" />
          {t("studentMode1_4")}
          <br />
          {t("studentMode2_1")}
          <br className="br-sp" />
          {t("studentMode2_2")}
        </p>
        <div className="studentImages">
          <div className="columns">
            <div className="column is-2">
              <img className="home" src={p1} />
              <p className="cap1">{t("home")}</p>
            </div>

            <div className="column is-2">
              <img className="record" src={p2} />
              <p className="cap2">{t("record")}</p>
            </div>

            <div className="column is-2">
              <img className="detail" src={p3} />
              <p className="cap3">{t("detail")}</p>
            </div>

            <div className="column is-2">
              <img className="compare" src={p4} />
              <p className="cap4">{t("comparePeformances")}</p>
            </div>
          </div>
        </div>

        <div className="columns" style={{ marginBottom: "0px" }}>
          <div className="column is-offset-3"></div>
          <div className="column is-2">
            <p className="img1">{t("clickHere")} ▼</p>
            <a href="https://suiview-s.vdslab.jp/">
              <img src={ogp_s} className="ogp_s" />
            </a>
            <p className="img1">（{t("recommendedSmartphone")}）</p>
          </div>

          <div className="column is-2">
            <img src={qr} className="qr" />
          </div>
          <div className="column is-offset-3"></div>
        </div>

        <div className="img-sp">
          <p className="img1">{t("clickHere")} ▼</p>
          <a href="https://suiview-s.vdslab.jp/">
            <img src={ogp_s} className="ogp_s_sp" />
          </a>
          <p className="img1">（{t("recommendedSmartphone")}）</p>
        </div>
      </div>

      <div className="teacher">
        <div className="teacherTitle">
          <h2 className="teacher">{t("teacherMode")}</h2>
        </div>
        <p className="teacher">
          {t("teacherMode1_1")}
          <br className="br-sp" />
          {t("teacherMode1_2")}
          <br />
          {t("teacherMode1_3")}
          <br />
          {t("teacherMode1_4")}
          <br />
          {t("teacherMode1_5")}
        </p>

        <img className="teacher" src={teacher} />

        <div className="ogp_t">
          <p>{t("clickHere")} ▼</p>
          <a href="https://suiview-t.vdslab.jp/">
            <img className="ogp_t" src={ogp_t} />
          </a>
          <p>（{t("recommendedPC")}）</p>
        </div>

        <div className="img-sp">
          <p>{t("clickHere")} ▼</p>
          <a href="https://suiview-t.vdslab.jp/">
            <img className="ogp_t_sp" src={ogp_t_sp} />
          </a>
          <p>（{t("recommendedPC")}）</p>
        </div>
      </div>

      <div className="description">
        <h3>{t("publications")}</h3>
        <div>
          <p>{t("publications1")}</p>
          <ul>
            <li>
              M. Watanabe, Y. Onoue, A. Uemura, and T. Kitahara, “Suiview: A
              Web-based Application that Enables Users to Practice Wind
              Instrument Performance,” in Proceedings of the 15th International
              Symposium on CMMR, 2021, pp. 5–10.
            </li>
            <li>
              渡邉みさと, 尾上洋介, 植村あい子, and 北原鉄朗,
              “管楽器を対象とした基礎的演奏技術向上のための音響特徴可視化アプリの試作,”
              2021.
            </li>
          </ul>
        </div>
      </div>

      <div className="footer">
        <div className="names">
          {t("watanabe")}, {t("numabe")}, {t("onoue")}, <br class="br-sp" />
          {t("uemura")}, {t("kitahara")}
          <br />
          {t("team")}
          <br />
          <br />
          <a href="https://vdslab.jp/">{t("lab1")}</a>
          <br />
          <a href="https://www.kthrlab.jp/">{t("lab2")}</a>
        </div>
      </div>
    </div>
  );
}
export default App;
