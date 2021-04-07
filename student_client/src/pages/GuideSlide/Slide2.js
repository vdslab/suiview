import { IonIcon, IonSlide } from "@ionic/react";
import img from "../../images/home_p.png";
import { folderOutline, micOutline } from "ionicons/icons";
//import "./Slide2.css";
import "./Slide4.css";

const Slide2 = () => {
  return (
    <IonSlide>
      <h2 className="title">ホーム画面</h2>　　
      <div className="position3">
        <p>
          左下の&ensp;
          <IonIcon icon={folderOutline} color="primary" />
          &ensp;から練習ファイルの
          追加ができます。
          <br />
          右下の&ensp;
          <IonIcon icon={micOutline} color="primary" />
          &ensp;からは録音ができます。
          <br />
          基礎的なフレーズフォルダが
          あらかじめ用意されています。
          <br />
          始めはロングトーンファイルに入ってみましょう。
        </p>
        <div className="picture4">  
          <img src={img} alt="ホーム画面" /*style={{ width: "50%" }}*/ />
        </div>
      </div>
      　　
    </IonSlide>
  );
};

export default Slide2;
