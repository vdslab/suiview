import { IonLoading, IonContent, IonPage, IonButton } from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import img from "../images/icon.png";

const Login = () => {
  const { isLoading, loginWithRedirect } = useAuth0();
  return (
    <IonPage>
      <IonContent>
        <div className="login_logo">
          <img src={img} alt="ロゴ画像" />
          <IonLoading isOpen={isLoading} />
          <p style={{ marginTop: "-0.125rem" }}>なんかひとこと</p>
          <IonButton onClick={loginWithRedirect} color="dark">
            ログイン
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
