import { IonSlide, IonIcon } from "@ionic/react";
import img from "../../images/recording.png";
import { radioButtonOnOutline } from "ionicons/icons";
import "./Slide4.css";

const Slide4 = () => {
  return (
    <IonSlide>
      <h2 className="title">録音画面</h2>　　
      <div className="position3">
        　
        <p /*style={{ marginBottom: "3rem" }}*/>
          下の&ensp;
          <IonIcon icon={radioButtonOnOutline} color="primary" />
          &ensp;を押すと録音が始まります。
          <br />
          録音が終わったら記録するボタンを押して記録しましょう。
          自己評価とコメントは任意で付けられます。後から追加、変更ができます。
        </p>
        <div className="picture">
          <img src={img} alt="録音画面" /*style={{ width: "50%" }}*/ />
        </div>
      </div>
    </IonSlide>
  );
};

export default Slide4;
