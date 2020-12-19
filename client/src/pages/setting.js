import React from "react";
import {
  IonHeader,
  IonList,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButton,
  IonBackButton,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
/////////////////////////////////////////////
const Setting = ({ history }) => {
  const { logout } = useAuth0();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonBackButton slot="start" defaultHref="/" icon={closeOutline} />
          <IonTitle>設定</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonButton
            slot="end"
            expand="full"
            color="light"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Log out
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Setting;
