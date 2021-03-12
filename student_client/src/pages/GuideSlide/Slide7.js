import { IonSlide } from "@ionic/react";
import img from "../../images/detail.png";

const Slide7 = () => {
  return (
    <IonSlide>
      <h2 className="title">曲詳細画面</h2>　　
      <div className="center">
        <p>
          一つ目のカードには、再生ボタン、曲名、自己評価、点数が表示されます。自己評価はタップすることで後から変更することができます。
          <br />
          グラフは先ほど同様、高さ・強さ・音色の3つのものを見ることができます。
        </p>
        <img src={img} alt="曲詳細画面" style={{ width: "50%" }} />
      </div>
    </IonSlide>
  );
};

export default Slide7;
