import { IonSlide } from "@ionic/react";
import img from "../../images/progress.png";
import "./Slide4.css";
import { useTranslation } from "react-i18next";

const Slide5 = () => {
  const { t } = useTranslation();
  return (
    <IonSlide>
      <h2 className="title">{t("folderScreen")}-2-</h2>　　
      <div className="position3">
        <p style={{ marginBottom: "1.5rem" }}>
          {t("guideSlide5p1")} <br />
          {t("guideSlide5p2")}
        </p>
        <div className="picture4">
          <img
            src={img}
            alt={t("recordingScreen")} /*style={{ width: "50%" }}*/
          />
        </div>
      </div>
    </IonSlide>
  );
};

export default Slide5;
