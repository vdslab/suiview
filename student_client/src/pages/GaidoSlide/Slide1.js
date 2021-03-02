import { IonSlide } from "@ionic/react";
import img from "../../images/icon.png";
const Slide1 = () => {
  return (
    <IonSlide style={{ height: "90vh" }}>
      <img src={img} alt="ロゴ画像" className="logo" />
      <div>
        <h2>吹viewにようこそ！</h2>
        <p>このアプリでは自分の音を録音し、</p>
        <p></p>
      </div>
    </IonSlide>
  );
};

export default Slide1;
