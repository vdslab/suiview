import { IonSlide } from "@ionic/react";
import img from "../../images/detail.png";

const Slide7 = () => {
  return (
    <IonSlide>
      <div className="slide_content" style={{ marginTop: "-2.5rem" }}>
        <h2>曲詳細画面</h2>　　　　
        <p>
          一つ目のカードには、再生ボタン、曲名、自己評価、点数が表示されます。自己評価はタップすることで後から変更することができます
        </p>
        <p>
          グラフは先ほど同様、高さ・強さ・音色の3つのものを見ることができます。
        </p>
      </div>
      <img
        src={img}
        alt="曲詳細画面"
        className="display_img"
        style={{ height: "50%", marginTop: "-2rem" }}
      />
    </IonSlide>
  );
};

export default Slide7;
