import { IonButton, IonSlide } from "@ionic/react";
//import { useHistory } from "react-router";

const Slide8 = () => {
  //const history = useHistory();
  function setVisited() {
    if (!("visited" in localStorage)) {
      localStorage.setItem("visited", "true");
    }
    //history.replace("./");
  }
  return (
    <IonSlide>
      <div className="slide_content" style={{ marginTop: "-2.5rem" }}>
        <p>気の利いた一言</p>
      </div>

      <IonButton
        routerLink={"/home"}
        //routerDirection={"root"}
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
