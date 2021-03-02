import { IonSlide } from "@ionic/react";

const Slide7 = () => {
  return (
    <IonSlide>
      <div className="slide_content" style={{ marginTop: "-2.5rem" }}>
        <h2>曲詳細画面</h2>　　　　
        <p style={{ marginTop: "-1rem" }}>点数の説明, 自己評価, 再生ボタンも</p>
        <p>グラフの説明</p>
        <p>コメントについての説明 </p>
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

export default Slide7;
