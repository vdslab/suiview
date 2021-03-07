import { IonSlide } from "@ionic/react";

const Slide5 = () => {
  return (
    <IonSlide>
      <div className="slide_content" /*style={{ marginTop: "-2.5rem" }}*/>
        <h2>フォルダ画面-2-</h2>　　　　
        <p /*style={{ marginTop: "-1rem" }}*/>
          録音データが集まると、フォルダ内での演奏データの比較ができるようになります。
          <br />
          もうちょい説明
          <br />
          また、演奏データをタップするとその演奏データの詳細情報を見ることができます。
        </p>
      </div>
      <p>図を入れる</p>
      {/*<img
        src={img}
        alt="録音画面"
        className="display_img"
        style={{ height: "50%", marginTop: "-2rem" }}
      />*/}
    </IonSlide>
  );
};

export default Slide5;
