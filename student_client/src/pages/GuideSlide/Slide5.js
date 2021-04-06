import { IonSlide } from "@ionic/react";
import img from "../../images/progress.png";
import "./Slide4.css"
const Slide5 = () => {
  return (
    <IonSlide>
      <h2 className="title">フォルダ画面-2-</h2>　　
      <div className="position3">
        <p style={{ marginBottom: "1.5rem" }}>
          録音データが集まると、フォルダ内での演奏データの比較ができるようになります。
          <br />
          また、演奏データをタップするとその演奏データの詳細情報を見ることができます。
        </p>
        <div className="picture">
          <img src={img} alt="録音画面"  /*style={{ width: "50%" }}*/ />
        </div>
      </div>
    </IonSlide>
  );
};

export default Slide5;
