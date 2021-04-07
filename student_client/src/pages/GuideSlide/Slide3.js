import { IonSlide, IonIcon } from "@ionic/react";
import img from "../../images/folder_p.png";
import { micOutline } from "ionicons/icons";
//import "./Slide2.css";
import "./Slide4.css";

const Slide3 = () => {
  return (
    <IonSlide>
      <h2 className="title">フォルダ画面</h2>　　
      <div className="position3">
        <p style={{ marginBottom: "4rem" }}>
          右下の&ensp;
          <IonIcon icon={micOutline} color="primary" />
          &ensp;から録音ができます。
          <br />
          <IonIcon icon={micOutline} color="primary" />
          を押して録音に進みましょう！
        </p>
        <div className="picture4">
          <img src={img} alt="フォルダ画面" /*style={{ width: "50%" }}*/ />
        </div>
      </div>
    </IonSlide>
  );
};

export default Slide3;
