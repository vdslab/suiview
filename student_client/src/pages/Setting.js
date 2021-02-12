import {
  IonHeader,
  IonList,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButton,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonItem,
  IonCardContent,
  IonIcon,
  useIonViewWillEnter,
  IonAlert,
} from "@ionic/react";
import { closeOutline, buildOutline } from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { getUsername, putUsername } from "../services/api/account";
/////////////////////////////////////////////
const Setting = () => {
  const { logout } = useAuth0();
  const [userData, setUserData] = useState();
  const { getAccessTokenSilently } = useAuth0();
  const [showAlert, setShowAlert] = useState(false);

  useIonViewWillEnter(async () => {
    const data = await getUsername(getAccessTokenSilently);
    setUserData(data);
  });

  console.log(userData);

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
          <IonCard>
            <IonCardHeader>アカウント情報</IonCardHeader>
            <IonCardContent>
              <IonItem lines="none" slot="end">
                ユーザー名：{userData ? userData["name"] : []}
                <IonButton
                  fill="outline"
                  color="dark"
                  slot="end"
                  onClick={() => setShowAlert(true)}
                >
                  <IonIcon icon={buildOutline} color="dark"></IonIcon>
                </IonButton>
              </IonItem>
              <IonItem lines="none" slot="end">
                ユーザーID：{userData ? userData["userId"] : []}
              </IonItem>
            </IonCardContent>
          </IonCard>
          <IonButton
            slot="end"
            expand="full"
            color="light"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Log out
          </IonButton>
        </IonList>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass="my-custom-class"
          header={"ユーザー名の変更"}
          subHeader={"新しいユーザー名を記入してください"}
          inputs={[
            {
              name: "name",
              type: "text",
              placeholder: "名前",
            },
          ]}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
              handler: () => {
                console.log("Confirm Cancel");
              },
            },
            {
              text: "OK",
              handler: async ({ name }) => {
                const data = await putUsername(
                  { name },
                  getAccessTokenSilently
                );
                //const data = await getUsername(getAccessTokenSilently);
                setUserData(data);
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Setting;
