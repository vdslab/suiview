import {
  IonContent,
  IonHeader,
  IonPage,
  IonSlides,
  IonToolbar,
  IonBackButton,
  IonTitle,
  IonButtons,
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
import { useTranslation } from "react-i18next";

const Gaido = ({ modal, history }) => {
  const { t } = useTranslation();
  return (
    <IonPage>
      {modal ? (
        []
      ) : (
        <IonHeader>
          <IonToolbar className="color">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
            </IonButtons>
            <IonTitle>{t("guide")}</IonTitle>
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
          {modal ? <Slide9 /> : []}
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default Gaido;
