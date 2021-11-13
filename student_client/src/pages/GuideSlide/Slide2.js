import { IonIcon, IonSlide } from "@ionic/react";
import img from "../../images/home_p.png";
import { folderOutline, micOutline } from "ionicons/icons";
//import "./Slide2.css";
import "./Slide4.css";
import { useTranslation } from "react-i18next";

const Slide2 = () => {
  const { t } = useTranslation();
  return (
    <IonSlide>
      <h2 className="title">{t("homeScreen")}</h2>　　
      <div className="position3">
        <p className="small_p">
          {t("guideSlide2p3")}
          <br />
          {t("guideSlide2p1")}&ensp;
          <IonIcon icon={folderOutline} color="primary" />
          &ensp;{t("guideSlide2p2")}
          <br />
          {t("guideSlide2p4")}
        </p>
        <div className="picture4">
          <img src={img} alt={t("homeScreen")} /*style={{ width: "50%" }}*/ />
        </div>
      </div>
      　　
    </IonSlide>
  );
};

export default Slide2;
