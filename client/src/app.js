import React from 'react'
import { Route } from 'react-router-dom'
import { IonApp, IonRouterOutlet } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'

import Root from './pages/root'

const App = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path='/' component={Root} exact />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
