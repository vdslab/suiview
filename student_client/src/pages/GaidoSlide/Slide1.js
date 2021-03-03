import { IonSlide } from "@ionic/react";
import img from "../../images/icon.PNG";
const Slide1 = () => {
  return (
    <IonSlide>
      <img
        src={img}
        alt="ロゴ画像"
        className="logo"
        style={{ height: "40%" }}
      />
      <div style={{ marginTop: "2rem" }}>
        <h2>吹viewにようこそ！</h2>
        <p>このアプリでは自分の音を録音し、</p>
        <p></p>
      </div>
    </IonSlide>
  );
};

export default Slide1;
