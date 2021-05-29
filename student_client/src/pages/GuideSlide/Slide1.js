import { IonSlide } from "@ionic/react";
import iconImg from "../../images/logo_b.png";
import "./Slide1.css";

const Slide1 = () => {
  return (
    <IonSlide>
      <div className="logo">
        <img src={iconImg} alt="ロゴ画像" /*style={{ width: "60%" }}*/ />
      </div>
      <div className="position">
        <h2 style={{ margin: "1.5rem" }}>吹viewにようこそ</h2>
        <p>
          管楽器の練習を始めたばかりの初心者が安定した音を出せるようにするためのお手伝いをするアプリです。
          <br />
          管楽器を練習したいユーザが気軽に録音し,高さ・強さ・音色の3観点からどの程度演奏が安定しているかを視覚的に確かめることができます。
        </p>
      </div>
    </IonSlide>
  );
};

export default Slide1;
