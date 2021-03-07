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
  IonLabel,
  IonItemDivider,
} from "@ionic/react";
import { chevronBackOutline, micOutline } from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { deleteMusic, getMusics } from "../services/api";
import MusicItem from "../components/MusicItem.js";
import { convertDate } from "../services/date.js";

const MusicList = ({ history }) => {
  const [musics, setMusics] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
  const [dateData, setDateData] = useState();

  useIonViewWillEnter(async () => {
    const data = await getMusics(getAccessTokenSilently);
    setMusics(data.music);
    setDateData(data.day);
  });

  const check = (date) => {
    for (let i = 0; i < dateData?.length; i++) {
      if (date === dateData[i][0] && dateData[i][1] === 0) {
        dateData[i][1] = 1;
        return 1;
      }
    }
    return 0;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="color">
          <IonBackButton
            slot="start"
            fill="clear"
            defaultHref="/"
            icon={chevronBackOutline}
          />
          <IonTitle>すべて</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {musics.map((data, id) => {
            const date = convertDate(data.created);
            return (
              <div key={id}>
                {check(date?.slice(0, 10)) === 1 ? (
                  <IonItemDivider>
                    <IonLabel>{date.slice(0, 10)}</IonLabel>
                  </IonItemDivider>
                ) : (
                  []
                )}
                <MusicItem
                  key={data.id}
                  music={data}
                  no={false}
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
              </div>
            );
          })}
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar className="color">
          <IonButton slot="end" fill="clear" routerLink="/recording/all">
            <IonIcon icon={micOutline}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default MusicList;
