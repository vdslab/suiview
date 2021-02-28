import {
  IonContent,
  IonHeader,
  IonPage,
  IonSlides,
  IonBackButton,
  IonTitle,
  IonCard,
  IonSlide,
  IonToolbar,
} from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import { chevronBackOutline } from "ionicons/icons";

function Slide1() {
  return (
    <IonSlide>
      <h1>hello</h1>
    </IonSlide>
  );
}

function Slide2() {
  return (
    <IonSlide>
      <h1>goodmorning</h1>
    </IonSlide>
  );
}
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
          {/*<Slide3 />
          <Slide4 />
          <Slide5 />*/}
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default Gaido;
