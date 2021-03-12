import { IonSlide } from "@ionic/react";
import img from "../../images/progress.png";

const Slide5 = () => {
  return (
    <IonSlide>
      <h2 className="title">フォルダ画面-2-</h2>　　
      <div className="center">
        <p style={{ marginBottom: "1.5rem" }}>
          録音データが集まると、フォルダ内での演奏データの比較ができるようになります。
          <br />
          また、演奏データをタップするとその演奏データの詳細情報を見ることができます。
        </p>
        <img src={img} alt="録音画面" d style={{ width: "50%" }} />
      </div>
    </IonSlide>
  );
};

export default Slide5;
