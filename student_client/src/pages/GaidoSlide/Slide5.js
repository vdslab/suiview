import { IonButton, IonSlide } from "@ionic/react";

const Slide5 = () => {
  function setVisited() {
    if (!("visited" in localStorage)) {
      localStorage.setItem("visited", "true");
    }
  }
  return (
    <IonSlide>
      グラフの画像
      <IonButton
        routerLink={"/home"}
        onClick={() => {
          setVisited();
        }}
      >
        start
      </IonButton>
    </IonSlide>
  );
};

export default Slide5;
