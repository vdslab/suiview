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
  IonInput,
  IonLabel,
  IonSelectOption,
  IonSelect,
} from "@ionic/react";
import { closeOutline, buildOutline /*shareOutline*/ } from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { getUsername, putUsername } from "../services/api/account";
import { useTranslation } from "react-i18next";
//import line_icon from "../images/LINE_APP.png";

/////////////////////////////////////////////
const Setting = () => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth0();
  const [userData, setUserData] = useState();
  const { getAccessTokenSilently } = useAuth0();
  const [showAlert, setShowAlert] = useState(false);

  useIonViewWillEnter(async () => {
    const data = await getUsername(getAccessTokenSilently);
    setUserData(data);
  });

  async function sendUsername(name) {
    const data = await putUsername({ name }, getAccessTokenSilently);
    setUserData(data);
  }

  const name = userData ? userData["name"] : "";
  const id = userData ? userData["userId"] : "";
  const url = `https://line.me/R/msg/text/?${name}さんのユーザーIDは${id}です。\nこのIDを生徒に登録して演奏にコメントをつけましょう。`;
  const encodedUrl = encodeURI(url);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="color">
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
                  slot="end"
                  onClick={() => setShowAlert(true)}
                >
                  <IonIcon icon={buildOutline}></IonIcon>
                </IonButton>
              </IonItem>
              <IonItem>
                ユーザーID&ensp;
                {userData ? (
                  <a href={encodedUrl}>
                    <IonButton fill="outline">
                      {/*} <IonIcon icon={shareOutline}></IonIcon>*/}
                      {/*} <img src={line_icon} style={{width:"1.5rem"}} alt={"LINEアイコン"}/>&ensp;*/}
                      LINEで共有する
                    </IonButton>
                  </a>
                ) : (
                  []
                )}
              </IonItem>
              <IonItem lines="none" slot="end">
                <IonInput value={userData ? userData["userId"] : []}></IonInput>
              </IonItem>
            </IonCardContent>
          </IonCard>
          <IonItem>
            <IonLabel position="stacked">{t("changeLanguage")}</IonLabel>
            <IonSelect
              value={i18n.language.slice(0, 2)}
              onIonChange={(event) => {
                i18n.changeLanguage(event.detail.value);
              }}
            >
              <IonSelectOption value="ja">{t("japanese")}</IonSelectOption>
              <IonSelectOption value="en">{t("english")}</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonButton
            slot="end"
            expand="full"
            color="light"
            routerLink="/setting/gaido"
          >
            利用ガイド
          </IonButton>
          {/*<IonButton
            slot="end"
            expand="full"
            color="light"
            routerLink="/setting/gaido"
          >
            上達への道
          </IonButton>*/}
          {/*<IonButton
            slot="end"
            expand="full"
            color="light"
            /*routerLink="/setting/gaido"
          >
            プライバシーポリシー
          </IonButton>*/}
          <IonButton
            slot="end"
            expand="full"
            color="light"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            ログアウト
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
                sendUsername(name);
                /*const data = await putUsername(
                  { name },
                  getAccessTokenSilently
                );
                setUserData(data);
                console.log(userData);*/
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Setting;
