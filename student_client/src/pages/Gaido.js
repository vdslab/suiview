import {
  IonContent,
  IonHeader,
  IonPage,
  IonSlides,
  IonBackButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { chevronBackOutline } from "ionicons/icons";
import { Slide1, Slide2, Slide3, Slide4, Slide5 } from "./GaidoSlide/index";

const Gaido = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonBackButton
            slot="start"
            defaultHref="/setting"
            icon={chevronBackOutline}
          />
          <IonTitle>利用ガイド</IonTitle>
        </IonToolbar>
      </IonHeader>
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
