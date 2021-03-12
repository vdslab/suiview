import { IonSlide, IonIcon } from "@ionic/react";
import img from "../../images/recording.png";
import { radioButtonOnOutline } from "ionicons/icons";

const Slide4 = () => {
  return (
    <IonSlide>
      <div className="slide_content" /*style={{ marginTop: "-2.5rem" }}*/>
        <h2>録音画面</h2>　　　　
        <p /*style={{ marginTop: "-1rem" }}*/>
          下の&ensp;
          <IonIcon icon={radioButtonOnOutline} />
          &ensp; を押すと録音が始まります。
          <br />
          録音が終わったら記録するボタンを押して記録しましょう。
          自己評価とコメントは任意で付けられます。後から追加、変更ができます。
        </p>
      </div>
      <img
        src={img}
        alt="録音画面"
        className="display_img"
        style={{ height: "50%" /* marginTop: "-2rem" */ }}
      />
    </IonSlide>
  );
};

export default Slide4;
