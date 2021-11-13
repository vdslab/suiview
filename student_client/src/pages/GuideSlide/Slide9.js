import { IonButton, IonSlide } from "@ionic/react";
import { useTranslation } from "react-i18next";

const Slide9 = () => {
  const { t } = useTranslation();
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
      <div className="center_m5">
        <p>
          {t("guideSlide9p1")}
          <br />
          {t("guideSlide9p2")}
        </p>
        <IonButton
          routerLink={"/home"}
          fill="outline"
          size="large"
          onClick={() => {
            setVisited();
          }}
        >
          {t("start")}
        </IonButton>
      </div>
    </IonSlide>
  );
};

export default Slide9;
