import { IonLoading, IonContent, IonPage, IonButton } from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import iconImg from "../images/logo_b.png";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { isLoading, loginWithRedirect } = useAuth0();
  const { t } = useTranslation();
  return (
    <IonPage>
      <IonContent>
        <div className="login_logo">
          <img src={iconImg} alt="logo" />
          <IonLoading isOpen={isLoading} />
          <IonButton
            onClick={loginWithRedirect}
            color="primary"
            style={{ marginTop: "1.25rem" }}
          >
            {t("login")}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
