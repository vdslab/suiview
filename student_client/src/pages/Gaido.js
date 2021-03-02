import { IonContent, IonPage, IonSlides } from "@ionic/react";
import { Slide1, Slide2, Slide3, Slide4, Slide5 } from "./GaidoSlide/index";

const Gaido = () => {
  return (
    <IonPage>
      <IonContent fullscreen class="ion-padding" scroll-y="false">
        <IonSlides pager={true} options={{ initialSlide: 0 }}>
          <Slide1 />
          <Slide2 />
          <Slide3 />
          <Slide4 />
          <Slide5 />
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default Gaido;
