import { IonSlide } from "@ionic/react";

const Slide6 = () => {
  return (
    <IonSlide>
      <div className="slide_content" style={{ marginTop: "-2.5rem" }}>
        <h2>グラフについて</h2>　　　　
        <p style={{ marginTop: "-1rem" }}>説明</p>
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

export default Slide6;
