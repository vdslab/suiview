import { IonSlide } from "@ionic/react";
import img_p from "../../images/progress.png";
import img_a from "../../images/all.png";
import "./Slide6.css";
import { useTranslation } from "react-i18next";

const Slide6 = () => {
  const { t } = useTranslation();
  return (
    <IonSlide>
      <h2 className="title_m">
        {t("guideSlide6p1")}
        <br />
        {t("guideSlide6p2")}
      </h2>
      　　
      <div className="position6">
        　　　 　　　　
        <p>
          {t("guideSlide6p3")}
          {t("guideSlide6p4")}
          {t("guideSlide6p5")}
        </p>
        <div className="pictures6">
          <img
            src={img_p}
            alt={t("folderScreen")}
            style={{ width: "40%", marginRight: "1rem" }}
          />
          <img
            src={img_a}
            alt={t("folderScreen")}
            style={{ width: "40%", marginLeft: "1rem" }}
          />
        </div>
      </div>
    </IonSlide>
  );
};

export default Slide6;
