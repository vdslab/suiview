import {
  IonHeader,
  IonLoading,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButton,
  IonFooter,
} from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { isLoading, loginWithRedirect } = useAuth0();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>吹view</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">
          <p>ここになんかすごいアプリの説明</p>
        </div>
        <IonLoading isOpen={isLoading} />
      </IonContent>
      <IonFooter>
        <IonButton expand="full" onClick={loginWithRedirect}>
          ログイン
        </IonButton>
      </IonFooter>
    </IonPage>
  );
};

export default Login;
