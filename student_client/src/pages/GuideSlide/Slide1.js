import { IonSlide } from "@ionic/react";
import iconImg from "../../images/logo_b.png";
import "./Slide1.css";
import { useTranslation } from "react-i18next";

const Slide1 = () => {
  const { t } = useTranslation();
  return (
    <IonSlide>
      <div className="logo">
        <img src={iconImg} alt="ロゴ画像" /*style={{ width: "60%" }}*/ />
      </div>
      <div className="position">
        <h2 style={{ margin: "1.5rem" }}>{t("welcomSuiview")}</h2>
        <p>
          {t("guideSlide1p1")}
          <br />
          {t("guideSlide1p2")}{" "}
        </p>
      </div>
    </IonSlide>
  );
};

export default Slide1;
