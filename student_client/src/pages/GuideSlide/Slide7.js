import { IonSlide } from "@ionic/react";
import img from "../../images/detail.png";
import "./Slide4.css";
import { useTranslation } from "react-i18next";

const Slide7 = () => {
  const { t } = useTranslation();
  return (
    <IonSlide>
      <h2 className="title">{t("detailScreen")}</h2>　　
      <div className="position3">
        <p className="small_p">
          {t("guideSlide7p1")}
          {t("guideSlide7p2")}
          {t("guideSlide7p3")}{" "}
        </p>
        <div className="picture5">
          <img src={img} alt={t("detailScreen")} /*style={{ width: "50%" }}*/ />
        </div>
      </div>
    </IonSlide>
  );
};

export default Slide7;
