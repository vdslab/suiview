import { IonSlide } from "@ionic/react";
import img_p from "../../images/progress.png";
import img_a from "../../images/all.png";
import "./Slide6.css";

const Slide6 = () => {
  return (
    <IonSlide>
      <h2 className="title_m">
        フォルダファイルでの
        <br />
        グラフについて
      </h2>
      　　
      <div className="position6">
        　　　 　　　　
        <p>
          各フォルダに保存したデータから5つのグラフを表示することができます。
          一つの録音データを高さ・強さ・音色の3観点から100点満点でどれくらい安定しているかを
          評価し、その結果が以下のグラフになります。
          左図が合計300満点での表記、右図がその内訳になります。
        </p>
        <div className="pictures6">
          <img
            src={img_p}
            alt="録音画面"
            style={{ width: "40%", marginRight: "1rem" }}
          />
          <img
            src={img_a}
            alt="録音画面"
            style={{ width: "40%", marginLeft: "1rem" }}
          />
        </div>
      </div>
    </IonSlide>
  );
};

export default Slide6;
