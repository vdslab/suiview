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
} from "@ionic/react";

const DetailPage = () => {
  const { musicId } = useParams();
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
      </IonContent>
    </IonPage>
  );
};

export default DetailPage;
