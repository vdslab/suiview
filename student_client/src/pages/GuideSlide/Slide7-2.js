import { IonIcon, IonSlide } from "@ionic/react";
import img from "../../images/detail.png";
import { createOutline } from "ionicons/icons";

const Slide7_2 = () => {
  return (
    <IonSlide>
      <h2 className="title">曲詳細画面-その2-</h2>　　
      <div className="center">
        <p style={{ marginBottom: "2rem" }}>
          3つめのカードにはコメントが表示されます。
          <IonIcon icon={createOutline} color="primary" />
          &ensp;からコメントを書くことができます。また、自分の演奏を聞いた人もコメントを付けることができます。
        </p>
        <img src={img} alt="曲詳細画面" style={{ width: "50%" }} />
      </div>
    </IonSlide>
  );
};

export default Slide7_2;
