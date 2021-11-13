import { IonIcon, IonSlide } from "@ionic/react";
import img from "../../images/detail.png";
import { createOutline } from "ionicons/icons";
import "./Slide4.css";
import { useTranslation } from "react-i18next";

const Slide7_2 = () => {
  const { t } = useTranslation();
  return (
    <IonSlide>
      <h2 className="title">{"detailScreen"}-2-</h2>　　
      <div className="position3">
        <p style={{ marginBottom: "2rem" }}>
          {t("guideSlide7p4")}
          {t("guideSlide7p5")}
          <IonIcon icon={createOutline} color="primary" />
          &ensp; {t("guideSlide7p6")} {t("guideSlide7p7")}
        </p>
        <div className="picture4">
          <img src={img} alt={t("detailScreen")} /*style={{ width: "50%" }}*/ />
        </div>
      </div>
    </IonSlide>
  );
};

export default Slide7_2;
