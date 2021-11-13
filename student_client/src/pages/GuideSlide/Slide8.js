import { IonSlide } from "@ionic/react";
import img from "../../images/ogp_tb.png";
import { useTranslation } from "react-i18next";

const Slide8 = () => {
  const { t } = useTranslation();
  return (
    <IonSlide>
      <h2 className="title">{t("guideSlide8p1")}</h2>　　
      <div className="position8">
        <p style={{ marginBottom: "3rem" }}>
          {t("guideSlide8p2")}
          {t("guideSlide8p3")}
          {t("guideSlide8p4")}
        </p>
        <div>
          <p>{t("guideSlide8p5")}</p>
          <div className="picture">
            <a href="https://suiview-t.vdslab.jp/">
              <img src={img} alt={t("teacherMode")} style={{ width: "70%" }} />
            </a>
          </div>
        </div>
      </div>
    </IonSlide>
  );
};

export default Slide8;
