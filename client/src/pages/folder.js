import React, { useEffect, useState } from "react";
import {
  IonHeader,
  IonItem,
  IonList,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButton,
  IonAlert,
  IonCard,
  IonIcon,
  IonInput,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonBackButton,
  useIonViewWillEnter,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonFooter,
} from "@ionic/react";
import {
  chevronForwardOutline,
  trashOutline,
  chevronBackOutline,
  micOutline,
} from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import {
  request_music_list,
  request_del_music,
  request_folder_name,
} from "../serviceWorker/index";
import { useParams } from "react-router-dom";

export const convertDate = (input) => {
  if (input === null) {
    return "";
  }

  const d = new Date(`${input} UTC`);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const date = `${d.getDate()}`.padStart(2, "0");
  const hour = `${d.getHours()}`.padStart(2, "0");
  const minute = `${d.getMinutes()}`.padStart(2, "0");
  /* const createdDay =
      year + "/" + month + "/" + date + "/" + hour + ":" + minute;*/
  const createdDay = year + "/" + month + "/" + date + "/";
  return createdDay;
};

////////////////////////////////////////////

const Folder = ({ history }) => {
  const [musics, setMusics] = useState();
  const id = useParams().foldername;
  const [folName, setFolName] = useState();

  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  useIonViewWillEnter(() => {
    request_music_list(id, getAccessTokenSilently).then((data) => {
      setMusics(data);
    });
  }, []);
  console.log(musics);

  useIonViewWillEnter(() => {
    request_folder_name(id, getAccessTokenSilently).then((data) => {
      setFolName(data);
    });
  }, []);
  console.log(folName);

  const delMusic = (id) => {
    console.log("del", id);
    request_del_music(id, getAccessTokenSilently).then((data) => {
      setMusics(data);
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonBackButton
            slot="start"
            defaultHref="/"
            icon={chevronBackOutline}
          />
          <IonTitle>{folName}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {musics !== undefined
            ? musics.map((data, i) => {
                return (
                  <IonItemSliding key={i}>
                    <IonItem
                      _ngcontent-yfv-c79=""
                      onClick={() => {
                        console.log(data);
                        history.push(`/detail/${data.id}/from/${id}`);
                      }}
                      detail="false"
                      target="_blank"
                      class="item md item-lines-full in-list ion-activatable ion-focusable item-label hydrated"
                    >
                      <IonLabel>
                        {convertDate(data.created)}&emsp;{data.name}&emsp;
                      </IonLabel>
                      <IonButton slot="end" fill="clear">
                        <IonIcon icon={chevronForwardOutline}></IonIcon>
                      </IonButton>
                    </IonItem>

                    <IonItemOptions>
                      <IonItemOption
                        color="danger"
                        expandable
                        onClick={() => {
                          delMusic(data.id);
                        }}
                      >
                        delete
                      </IonItemOption>
                    </IonItemOptions>
                  </IonItemSliding>
                );
              })
            : []}
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButton
            slot="end"
            fill="clear"
            onClick={() => history.push(`/recording/all`)}
          >
            <IonIcon icon={micOutline}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Folder;
