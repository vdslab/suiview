import { IonSlide } from "@ionic/react";
import img from "../../images/progress.png";

const Slide5 = () => {
  return (
    <IonSlide>
      <div className="slide_content" /*style={{ marginTop: "-2.5rem" }}*/>
        <h2>フォルダ画面-2-</h2>　　　　
        <p /*style={{ marginTop: "-1rem" }}*/>
          録音データが集まると、フォルダ内での演奏データの比較ができるようになります。
          <br />
          また、演奏データをタップするとその演奏データの詳細情報を見ることができます。
        </p>
      </div>
      {
        <img
          src={img}
          alt="録音画面"
          className="display_img"
          style={{ height: "50%" }}
        />
      }
    </IonSlide>
  );
};

export default Slide5;
