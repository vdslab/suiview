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
      <div className="slide_content" style={{ marginTop: "-2.5rem" }}>
        <p>
          それではさっそく
          <br />
          一緒に練習してみましょう！
        </p>
      </div>

      <IonButton
        routerLink={"/home"}
        onClick={() => {
          setVisited();
        }}
      >
        はじめる
      </IonButton>
    </IonSlide>
  );
};

export default Slide8;
