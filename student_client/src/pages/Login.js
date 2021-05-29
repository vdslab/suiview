import { IonLoading, IonContent, IonPage, IonButton } from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import iconImg from "../images/logo_b.png";
const Login = () => {
  const { isLoading, loginWithRedirect } = useAuth0();

  return (
    <IonPage>
      <IonContent>
        <div className="login_logo">
          <img src={iconImg} alt="ロゴ画像" />
          <IonLoading isOpen={isLoading} />
          <IonButton
            onClick={loginWithRedirect}
            color="primary"
            style={{ marginTop: "1.25rem" }}
          >
            ログイン
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
