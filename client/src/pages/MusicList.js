import { useState } from "react";
import {
  IonHeader,
  IonList,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButton,
  IonIcon,
  IonBackButton,
  useIonViewWillEnter,
  IonFooter,
} from "@ionic/react";
import { chevronBackOutline, micOutline } from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { deleteMusic, getMusics } from "../services/api";
import MusicItem from "../components/MusicItem.js";

const MusicList = ({ history }) => {
  const [musics, setMusics] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  useIonViewWillEnter(async () => {
    const data = await getMusics(getAccessTokenSilently);
    setMusics(data);
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonBackButton
            slot="start"
            fill="clear"
            defaultHref="/"
            icon={chevronBackOutline}
          ></IonBackButton>
          <IonTitle>すべて</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {musics.map((data) => {
            return (
              <MusicItem
                key={data.id}
                music={data}
                routerLink={`/detail/${data.id}/from/all`}
                onClickMoveButton={() => {
                  history.push(`/select_folder/${data.id}`);
                }}
                onClickDeleteButton={async () => {
                  await deleteMusic(data.id, getAccessTokenSilently);
                  const musics = await getMusics(getAccessTokenSilently);
                  setMusics(musics);
                }}
              />
            );
          })}
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButton slot="end" fill="clear" routerLink="/recording/all">
            <IonIcon icon={micOutline}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default MusicList;
