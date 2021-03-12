import { IonSlide } from "@ionic/react";
import img_f from "../../images/fol_f0.png";
import img_v from "../../images/fol_vol.png";
import img_t from "../../images/fol_tone.png";

const Slide6_2 = () => {
  return (
    <IonSlide>
      <div className="slide_content" style={{ marginTop: "-2.5rem" }}>
        <h2>
          フォルダファイルでの
          <br />
          グラフについて-その2-
        </h2>
        　　　　
        <p style={{ marginTop: "-1rem" }}>
          高さ・強さ・音色のそれぞれを重ねたグラフも見ることができます。癖などの把握に役立てることができます。
        </p>
      </div>
      {
        <div>
          <img
            src={img_f}
            alt="録音画面"
            className="display_img"
            style={{ height: "35%", marginLeft: "-8rem" }}
          />
          <img
            src={img_v}
            alt="録音画面"
            className="display_img"
            style={{ height: "35%" }}
          />
          <img
            src={img_t}
            alt="録音画面"
            className="display_img"
            style={{ height: "35%", marginLeft: "8rem" }}
          />
        </div>
      }
    </IonSlide>
  );
};

export default Slide6_2;
