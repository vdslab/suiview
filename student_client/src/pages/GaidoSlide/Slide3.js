import { IonSlide, IonIcon } from "@ionic/react";
import img from "../../images/folder_p.png";
import { micOutline } from "ionicons/icons";

const Slide3 = () => {
  return (
    <IonSlide>
      <div className="slide_content" style={{ marginTop: "-4rem" }}>
        <h2>フォルダ画面</h2>　　　　
        <p>
          右下の&ensp;
          <IonIcon icon={micOutline} />
          &ensp; から録音ができます
        </p>
        <p>
          <IonIcon icon={micOutline} />
          を押して録音に進みましょう！
        </p>
      </div>
      <img
        src={img}
        alt="フォルダ画面"
        className="display_img"
        style={{ height: "55%", marginTop: "-4rem" }}
      />
    </IonSlide>
  );
};

export default Slide3;
