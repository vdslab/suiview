import { IonSlide } from "@ionic/react";
import img from "../../images/ogp_t.png";

const Slide8 = () => {
  return (
    <IonSlide>
      <div className="slide_content">
        <h2>演奏を聴いてもらう</h2>
        <a href="https://suiview-t.vdslab.jp/">
          <img src={img} alt="先生モード" style={{ width: "60%" }} />
        </a>
        <p>
          このアプリで録音したデータは先生モードから別の人も聞くことができます。
          自分の演奏を聴いてもらうには、聞いてもらいたい人にIDを伝える必要があります。
          設定からユーザーIDを確認して伝えてみましょう。
        </p>
      </div>
    </IonSlide>
  );
};

export default Slide8;
