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
  Slide62,
  Slide7,
  Slide72,
  Slide8,
  Slide9,
} from "./GuideSlide/index";
import { chevronBackOutline } from "ionicons/icons";

const Gaido = ({ modal, history }) => {
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
          <Slide62 />
          <Slide7 />
          <Slide72 />
          <Slide8 />
          {/*<Slide9 />*/}
          {modal ? <Slide9 /> : []}
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default Gaido;