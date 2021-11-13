import { IonSlide, IonIcon } from "@ionic/react";
import img from "../../images/folder_p.png";
import { micOutline } from "ionicons/icons";
//import "./Slide2.css";
import "./Slide4.css";
import { useTranslation } from "react-i18next";

const Slide3 = () => {
  const { t } = useTranslation();
  return (
    <IonSlide>
      <h2 className="title">{t("folderScreen")}</h2>　　
      <div className="position3">
        <p style={{ marginBottom: "4rem" }}>
          {t("guideSlide3p1")}&ensp;
          <IonIcon icon={micOutline} color="primary" />
          &ensp;{t("addDataFromBottomRight")}
          <br />
          {t("guideSlide3p2")}
          <IonIcon icon={micOutline} color="primary" />
          {t("guideSlide3p3")}
        </p>
        <div className="picture4">
          <img src={img} alt={t("folderScreen")} /*style={{ width: "50%" }}*/ />
        </div>
      </div>
    </IonSlide>
  );
};

export default Slide3;
