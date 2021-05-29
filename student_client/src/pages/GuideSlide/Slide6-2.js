import { IonSlide } from "@ionic/react";
import img_f from "../../images/fol_f0.png";
import img_v from "../../images/fol_vol.png";
import img_t from "../../images/fol_tone.png";
import "./Slide62.css";

const Slide6_2 = () => {
  return (
    <IonSlide>
      <h2 className="title_m">
        フォルダファイルでの
        <br />
        グラフについて-その2-
      </h2>
      　　
      <div className="position6">
        <p>
          高さ・強さ・音色のそれぞれを重ねたグラフも見ることができます。癖などの把握に役立てることができます。
        </p>
        <div className="pictures2">
          <img src={img_f} alt="録音画面" style={{ width: "45%" }} />
          <img src={img_v} alt="録音画面" style={{ width: "45%" }} />
          <img src={img_t} alt="録音画面" style={{ width: "45%" }} />
        </div>
      </div>
    </IonSlide>
  );
};

export default Slide6_2;
