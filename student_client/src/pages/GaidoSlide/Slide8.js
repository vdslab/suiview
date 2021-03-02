import { IonButton, IonSlide } from "@ionic/react";

const Slide5 = () => {
  function setVisited() {
    if (!("visited" in localStorage)) {
      localStorage.setItem("visited", "true");
    }
  }
  return (
    <IonSlide>
      <div className="slide_content" style={{ marginTop: "-2.5rem" }}>
        <p>気の利いた一言</p>
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

export default Slide5;
