import {
  IonContent,
  IonHeader,
  IonPage,
  IonSlides,
  IonToolbar,
  IonBackButton,
  IonTitle,
} from "@ionic/react";
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
import { chevronBackOutline } from "ionicons/icons";

const Gaido = ({ modal }) => {
  console.log(modal);
  return (
    <IonPage>
      {modal ? (
        []
      ) : (
        <IonHeader>
          {" "}
          <IonToolbar>
            <IonBackButton
              slot="start"
              defaultHref="/"
              icon={chevronBackOutline}
            />
            <IonTitle>利用ガイド</IonTitle>
          </IonToolbar>
        </IonHeader>
      )}
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
          {modal ? <Slide8 /> : []}
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default Gaido;
