import { IonSlide, IonIcon } from "@ionic/react";
import img from "../../images/recording.png";
import { radioButtonOnOutline } from "ionicons/icons";
import "./Slide4.css";
import { useTranslation } from "react-i18next";

const Slide4 = () => {
  const { t } = useTranslation();
  return (
    <IonSlide>
      <h2 className="title">{t("recordingScreen")}</h2>　　
      <div className="position3">
        　
        <p /*style={{ marginBottom: "3rem" }}*/>
          {t("guideSlide4p1")}&ensp;
          <IonIcon icon={radioButtonOnOutline} color="primary" />
          &ensp;{t("guideSlide4p2")}
          <br />
          {t("guideSlide4p3")}
          {t("guideSlide4p4")}
        </p>
        <div className="picture4">
          <img src={img} alt="録音画面" /*style={{ width: "50%" }}*/ />
        </div>
      </div>
    </IonSlide>
  );
};

export default Slide4;
