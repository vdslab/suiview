import { IonSlide } from "@ionic/react";
import img_p from "../../images/progress.png";
import img_a from "../../images/all.png";

const Slide6 = () => {
  return (
    <IonSlide>
      <div className="slide_content" style={{ marginTop: "-2.5rem" }}>
        <h2>
          フォルダファイルでの
          <br />
          グラフについて
        </h2>
        　　　　
        <p style={{ marginTop: "-1rem" }}>
          各フォルダに保存したデータから5つのグラフを表示することができます。
          一つの録音データを高さ・強さ・音色の3観点から100点満点でどれくらい安定しているかを
          評価し、その結果が以下のグラフになります。
          左図が合計300満点での表記、右図がその内訳になります。
        </p>
      </div>
      {
        <div>
          <img
            src={img_p}
            alt="録音画面"
            className="display_img"
            style={{ height: "40%", marginLeft: "-6.25rem" }}
          />
          <img
            src={img_a}
            alt="録音画面"
            className="display_img"
            style={{ height: "40%", marginLeft: "6.25rem" }}
          />
        </div>
      }
    </IonSlide>
  );
};

export default Slide6;
