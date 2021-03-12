import { IonSlide } from "@ionic/react";
import iconImg from "../../images/logo.PNG";
const Slide1 = () => {
  return (
    <IonSlide>
      <img
        src={iconImg}
        alt="ロゴ画像"
        className="logo"
        style={{ height: "30%" }}
      />
      <div className="slide_content1">
        <h2>吹viewにようこそ</h2>
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
