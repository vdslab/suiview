import { IonButton, IonSlide } from "@ionic/react";

const Slide8 = () => {
  function logined() {
    if ("visited" in localStorage) {
      return true;
    } else {
      return false;
    }
  }

  function setVisited() {
    if (!logined()) {
      localStorage.setItem("visited", "true");
    }
  }
  return (
    <IonSlide>
      <div className="center_m5">
        <p>
          それではさっそく
          <br />
          一緒に練習してみましょう！
        </p>
        <IonButton
          routerLink={"/home"}
          fill="outline"
          size="large"
          onClick={() => {
            setVisited();
          }}
        >
          はじめる
        </IonButton>
      </div>
    </IonSlide>
  );
};

export default Slide8;
