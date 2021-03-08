import { IonSlide } from "@ionic/react";
import img from "../../images/detail.png";

const Slide7_2 = () => {
  return (
    <IonSlide>
      <div className="slide_content" style={{ marginTop: "-2.5rem" }}>
        <h2>曲詳細画面-その2-</h2>　　　　
        <p>
          3つめのカードにはコメントが表示されます。右下のアイコンからコメントを書くことができます。また、自分の演奏を聞いた人もコメントを付けることができます。
        </p>
      </div>

      <img
        src={img}
        alt="曲詳細画面"
        className="display_img"
        style={{ height: "50%", marginTop: "-2rem" }}
      />
    </IonSlide>
  );
};

export default Slide7_2;
