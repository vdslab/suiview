import { IonSlide } from "@ionic/react";

const Slide8 = () => {
  return (
    <IonSlide>
      <div className="slide_content" style={{ marginTop: "-2.5rem" }}>
        <h2>演奏を聴いてもらう</h2>　　　 　　　
        <p>
          このアプリで録音したデータは先生モードから別の人も聞くことができます。
          自分の演奏を聴いてもらうには、聞いてもらいたい人にIDを伝える必要があります。
          設定からユーザーIDを確認して伝えてみましょう。
        </p>
      </div>
    </IonSlide>
  );
};

export default Slide8;
