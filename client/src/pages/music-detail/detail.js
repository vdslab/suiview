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
} from "@ionic/react";

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
  console.log(createdDay);
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
  console.log(comment);
  console.log(musicId);
};

const Comments = ({ data }) => {
return( <div>
  <IonList>
  {data? Object.keys(data).map(key=>{
    console.log(data[key]);
    return(<div>
      <IonItem>
      <IonLabel>{convertDate(data[key].created)}</IonLabel>
      {data[key].comment}
      </IonItem>
      </div>
      )
  }):console.log("null")}
</IonList>
</div>);
};

const DetailPage = () => {
  const { musicId } = useParams();
  const [comment, setComment] = useState();
  const [oldComment, setOldComment] = useState(null);
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>track{musicId}</IonTitle>
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
          {/*console.log(oldComment)*/}
          <Comments data={oldComment} />
        </IonList>

        {/*<IonButton
          onClick={() => {
            setCreatedDay(getCreatDate());
          }}
        >
          【creat!!】
          {createdDay}
        </IonButton>*/}
      </IonContent>
    </IonPage>
  );
};

export default DetailPage;
