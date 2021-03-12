import { IonSlide, IonIcon } from "@ionic/react";
import img from "../../images/folder_p.png";
import { micOutline } from "ionicons/icons";

const Slide3 = () => {
  return (
    <IonSlide>
      <h2 className="title">フォルダ画面</h2>　　
      <div className="center">
        <p style={{ marginBottom: "4rem" }}>
          右下の&ensp;
          <IonIcon icon={micOutline} color="primary" />
          &ensp;から録音ができます。
          <br />
          <IonIcon icon={micOutline} color="primary" />
          を押して録音に進みましょう！
        </p>
        <img src={img} alt="フォルダ画面" style={{ width: "50%" }} />
      </div>
    </IonSlide>
  );
};

export default Slide3;
