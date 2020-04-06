import React from 'react'
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
} from '@ionic/react'

const Root = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>title</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h1>hello</h1>
      </IonContent>
    </IonPage>
  )
}

export default Root
