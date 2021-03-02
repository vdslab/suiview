import { IonContent, IonPage, IonSlides } from "@ionic/react";
import {
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
  Slide6,
  Slide7,
  Slide8,
} from "./GaidoSlide/index";

const Gaido = () => {
  return (
    <IonPage>
      <IonContent fullscreen class="ion-padding" scroll-y="false">
        <IonSlides
          pager={true}
          options={{ initialSlide: 0 }}
          style={{ height: "100%" }}
        >
          <Slide1 />
          <Slide2 />
          <Slide3 />
          <Slide4 />
          <Slide5 />
          <Slide6 />
          <Slide7 />
          <Slide8 />
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default Gaido;
