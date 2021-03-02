import { IonIcon, IonSlide } from "@ionic/react";
import img from "../../images/home_p.png";
import { folderOutline, micOutline } from "ionicons/icons";

const Slide2 = () => {
  return (
    <IonSlide>
      <div className="slide_content" style={{ marginTop: "-1rem" }}>
        <h2>ホーム画面</h2>　　　　
        <p style={{ marginTop: "-1rem" }}>
          左下の&ensp;
          <IonIcon icon={folderOutline} />
          &ensp; 練習ファイルの追加ができます。
        </p>
        <p>
          右下の&ensp;
          <IonIcon icon={micOutline} />
          &ensp;からは録音ができます。
        </p>
        <p>基礎的なフレーズフォルダがあらかじめ用意されています。</p>
        <p>始めはロングトーンファイルに入ってみましょう。</p>
      </div>
      <img
        src={img}
        alt="ホーム画面"
        className="display_img"
        style={{ height: "45%" }}
      />
    </IonSlide>
  );
};

export default Slide2;
