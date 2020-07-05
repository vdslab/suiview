import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonBackButton,
  IonButtons,
  IonButton,
  IonInput,
  IonCard,
  IonList,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";

//export したのだとバグる
const FolderName = ({ id }) => {
  const [folderName, setFolderName] = useState();
  useEffect(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics/folders/${id}`)
      .then((response) => response.json())
      .then((folderName) => {
        setFolderName(folderName);
      });
  }, []);
  //console.log(id);
  return <div>{folderName}</div>;
};

//index.js で export したのをimportするとなんかおかしくなる
const convertDate = (input) => {
  if (input === null) {
    return "";
  }

  const d = new Date(`${input} UTC`);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const date = `${d.getDate()}`.padStart(2, "0");
  const hour = `${d.getHours()}`.padStart(2, "0");
  const minute = `${d.getMinutes()}`.padStart(2, "0");
  const createdDay =
    year + "/" + month + "/" + date + "/" + hour + ":" + minute;
  //console.log(createdDay);
  return createdDay;
};

const SaveComment = (comment, musicId) => {
  window.fetch(
    `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/comments`,
    {
      method: "PUT",
      body: comment,
    }
  );
  //console.log(comment);
  //console.log(musicId);
};

const SaveFolder = (folderId, musicId) => {
  let folder_ids = "";
  folderId.map((input) => {
    folder_ids += input + ",";
  });
  //console.log(folder_ids);
  //console.log(musicId);
  window.fetch(
    `${process.env.REACT_APP_API_ENDPOINT}/1/musics/put_folders/${musicId}`,
    //`${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/${folderId}`,
    {
      method: "PUT",
      body: folder_ids,
    }
  );
};

const changeName = (name, musicId) => {
  console.log(musicId);
  window.fetch(
    `${process.env.REACT_APP_API_ENDPOINT}/1/musics/change_name/${musicId}`,
    {
      method: "PUT",
      body: name,
    }
  );
};

const Comments = ({ data }) => {
  return (
    <div>
      <IonList>
        {data
          ? Object.keys(data).map((key) => {
              return (
                <div>
                  <IonItem>
                    <IonLabel>{convertDate(data[key].created)}</IonLabel>
                    {data[key].comment}
                  </IonItem>
                </div>
              );
            })
          : ""}
      </IonList>
    </div>
  );
};

const DetailPage = () => {
  const { musicId } = useParams();
  const [comment, setComment] = useState();
  const [oldComment, setOldComment] = useState(null);
  const [folder, setFolder] = useState(null);
  const [folderData, setFolderData] = useState();
  const [folderId, setFolderId] = useState();
  const [musicName, setMusicName] = useState();
  useEffect(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics/folders2`)
      .then((response) => response.json())
      .then((folderData) => {
        setFolderData(folderData);
      });
  }, []);

  let folder_ids = null;
  if (folderData !== undefined) {
    folder_ids = Array.from(
      new Set(
        folderData.map((input) => {
          return input.id;
        })
      )
    );
  }

  console.log(folder_ids);
  useEffect(() => {
    window
      .fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/comments`
      )
      .then((response) => response.json())
      .then((oldComment) => {
        setOldComment(oldComment);
      });
  }, []);
  // console.log(oldComment);

  useEffect(() => {
    window
      .fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/music_name`
      )
      .then((response) => response.json())
      .then((musicName) => {
        setMusicName(musicName);
      });
  }, []);

  console.log(musicName);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>
            No{musicId} : {musicName}
          </IonTitle>
          <IonItem>
            名前の変更：
            <IonInput
              value={musicName}
              placeholder=""
              onIonChange={(e) => {
                setMusicName(e.detail.value);
              }}
            ></IonInput>
            <IonButton
              slot="end"
              onClick={() => {
                console.log(musicName, musicId);
                changeName(musicName, musicId);
                //console.log(addFol);
                //addFolder(addFol);
              }}
            >
              【add】
            </IonButton>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonItem>
        play
        <audio
          controls
          src={`${process.env.REACT_APP_API_ENDPOINT}/1/musics/${musicId}/content`}
        />
      </IonItem>

      <IonContent>
        <IonButton
          color="medium"
          key={musicId}
          routerLink={`/musics/${musicId}`}
        >
          amplitude
        </IonButton>
        <IonButton
          color="light"
          key={musicId}
          routerLink={`/fourier/${musicId}`}
        >
          fourier
        </IonButton>
        <IonButton
          color="medium"
          key={musicId}
          routerLink={`/spectrogram/${musicId}`}
        >
          spectrogram
        </IonButton>
        <IonButton
          color="light"
          key={musicId}
          routerLink={`/frequency/${musicId}`}
        >
          frequency
        </IonButton>

        {/*<IonCard>
          <IonItem>
            <IonInput
              value={folder}
              placeholder="folderName"
              onIonChange={(e) => {
                setFolder(e.detail.value);
              }}
            ></IonInput>
            <IonButton
              slot="end"
              onClick={() => {
                SaveFolder(folder, musicId);
              }}
            >
              【save】
            </IonButton>
          </IonItem>
            </IonCard>*/}

        <IonCard>
          <IonItem>登録するフォルダを選択</IonItem>
          <IonItem>
            <IonLabel>number</IonLabel>
            <IonSelect
              value={folderId}
              placeholder="select one"
              multiple={true}
              onIonChange={(e) => setFolderId(e.detail.value)}
            >
              {folder_ids
                ? folder_ids.map((id) => {
                    return (
                      <IonSelectOption value={id}>
                        No.{id} <FolderName id={id} />
                      </IonSelectOption>
                    );
                  })
                : ""}
            </IonSelect>
            <IonButton
              slot="end"
              color="dark"
              size="big"
              key={folderId}
              onClick={() => SaveFolder(folderId, musicId)}
            >
              save
            </IonButton>
          </IonItem>
        </IonCard>

        <IonCard>
          <IonItem>
            <IonInput
              value={comment}
              placeholder="comment"
              onIonChange={(e) => {
                setComment(e.detail.value);
              }}
            ></IonInput>
            <IonButton
              slot="end"
              onClick={() => {
                SaveComment(comment, musicId);
              }}
            >
              【save】
            </IonButton>
          </IonItem>
        </IonCard>

        <IonList>
          <Comments data={oldComment} />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default DetailPage;
