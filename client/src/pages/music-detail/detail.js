import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IonHeader,
  IonItem,
  IonList,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonBackButton,
  IonButtons,
  IonButton,
  IonInput,
  IonLabel,
  IonCard,
} from "@ionic/react";

const DetailPage = () => {
  const { musicId } = useParams();
  const [comment, setComment] = useState();
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
          {/*日時を入れる<IonItem lines="none">{comment}</IonItem>*/}
          <IonItem>
            <IonInput
              value={comment}
              placeholder="comment"
              onIonChange={(e) => {
                setComment(e.detail.value);
              }}
            ></IonInput>
          </IonItem>
        </IonCard>

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
