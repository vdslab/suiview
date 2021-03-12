import { IonIcon, IonSlide } from "@ionic/react";
import img from "../../images/home_p.png";
import { folderOutline, micOutline } from "ionicons/icons";

const Slide2 = () => {
  return (
    <IonSlide>
      <h2 className="title">ホーム画面</h2>　　
      <div className="center">
        <p>
          左下の&ensp;
          <IonIcon icon={folderOutline} color="primary" />
          &ensp;から練習ファイルの
          <br />
          追加ができます。
          <br />
          右下の&ensp;
          <IonIcon icon={micOutline} color="primary" />
          &ensp;からは録音ができます。
          <br />
          基礎的なフレーズフォルダが
          <br />
          あらかじめ用意されています。
          <br />
          始めはロングトーンファイルに
          <br />
          入ってみましょう。
        </p>
        <img src={img} alt="ホーム画面" style={{ width: "50%" }} />
      </div>
      　　
    </IonSlide>
  );
};

export default Slide2;
