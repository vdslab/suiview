import React, { useState } from "react";
import {
  IonHeader,
  IonItem,
  IonList,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonLabel,
  IonListHeader,
  IonBackButton,
  IonFooter,
  IonAlert,
  useIonViewWillEnter,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import {
  request_folder_list,
  request_music_name,
  request_add_folder,
  request_change_folder,
} from "../serviceWorker/index";
import { useParams } from "react-router-dom";
/////////////////////////////////////////////
const SelectFolder = ({ history }) => {
  const folderId = useParams().folderId;
  const musicId = useParams().musicId;
  const [musicName, setMusicName] = useState();
  const [folderList, setFolderList] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  console.log(musicId);

  useIonViewWillEnter(() => {
    request_folder_list(getAccessTokenSilently).then((data) => {
      setFolderList(data);
    });
  }, []);

  useIonViewWillEnter(() => {
    request_music_name(musicId, getAccessTokenSilently).then((data) => {
      setMusicName(data);
    });
  }, []);
  console.log(folderList);

  const addFol = (name) => {
    console.log(name);
    request_add_folder(name, getAccessTokenSilently).then((data) => {
      setFolderList(data);
    }); /*
      .then(() => {
        console.log(folderList[folderList.length - 1].id);
        ChangeFol(folderList[folderList.length - 1].id);
      });*/
  };

  const ChangeFol = (id) => {
    console.log(id);
    request_change_folder(musicId, id, getAccessTokenSilently).then(() => {
      /*できれば遷移の仕方分けたい*/
      /*  if (from == "detail") {
        history.push("/");
      } else {
        history.push(`/folder/${folderId}`);
      }*/
      history.push("/");
    });
  };

  const { getAccessTokenSilently } = useAuth0();

  //console.log(r);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonBackButton slot="start" defaultHref="/" icon={closeOutline} />
          <IonTitle>フォルダの選択</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonListHeader lines="full">
            <IonLabel>{musicName}</IonLabel>
          </IonListHeader>
          {/*CSS書き直す*/}
          <IonItem
            color="light"
            detail="false"
            target="_blank"
            class="item md item-lines-full in-list ion-activatable ion-focusable item-label hydrated"
            onClick={() => {
              setShowAlert(true);
            }}
          >
            <IonLabel>新規フォルダ</IonLabel>
          </IonItem>
          {folderList != null
            ? folderList.map((d, id) => {
                if (d.id === folderId) {
                  return (
                    <IonItem key={id} color="medium">
                      <IonLabel>{d.name}</IonLabel>
                    </IonItem>
                  );
                } else {
                  return (
                    <IonItem
                      key={id}
                      detail="false"
                      target="_blank"
                      class="item md item-lines-full in-list ion-activatable ion-focusable item-label hydrated"
                      onClick={() => {
                        ChangeFol(d.id);
                      }}
                    >
                      <IonLabel>{d.name}</IonLabel>
                    </IonItem>
                  );
                }
              })
            : []}
        </IonList>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass="my-custom-class"
          header={"新規フォルダ"}
          subHeader={"フォルダの名前を記入してください"}
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
            },
            {
              text: "Ok",
              handler: (data) => {
                addFol(data.name);
              },
            },
          ]}
        />
      </IonContent>
      <IonFooter></IonFooter>
    </IonPage>
  );
};

export default SelectFolder;
