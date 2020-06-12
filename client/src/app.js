import React from "react";
import { Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Root from "./pages/root";
import MusicDetail from "./pages/music-detail";
import ShowFourier from "./pages/music-detail/fourier";
import ShowSpectrogram from "./pages/music-detail/spectrogram";
import ShowFrequency from "./pages/music-detail/frequency";
import ShowComp from "./pages/music-detail/compare";
import DetailPage from "./pages/music-detail/detail";

const App = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" component={Root} exact />
          <Route path="/musics/:musicId" component={MusicDetail} />
          <Route path="/fourier/:musicId" component={ShowFourier} />
          <Route path="/spectrogram/:musicId" component={ShowSpectrogram} />
          <Route path="/frequency/:musicId" component={ShowFrequency} />
          <Route path="/comp_chart/:musicId/:musicId2" component={ShowComp} />
          <Route path="/detail/:musicId/" component={DetailPage} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
