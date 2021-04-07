import { IonSlide } from "@ionic/react";
import img from "../../images/detail.png";
import "./Slide4.css"

const Slide7 = () => {
  return (
    <IonSlide>
      <h2 className="title">曲詳細画面</h2>　　
      <div className="position3">
        <p>
          一つ目のカードには、再生ボタン、曲名、自己評価、点数が表示されます。自己評価はタップすることで後から変更することができます。
          <br />
          グラフは先ほど同様、高さ・強さ・音色の3つのものを見ることができます。
        </p>
        <div className="picture">
          <img src={img} alt="曲詳細画面" style={{ width: "50%" }} />
        </div>
      </div>
    </IonSlide>
  );
};

export default Slide7;
