import React from "react";
import { Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Root from "./pages/root";
import MusicDetail from "./pages/music-detail/index";
import ShowFourier from "./pages/music-detail/fourier";
import ShowSpectrogram from "./pages/music-detail/spectrogram";
import ShowFrequency from "./pages/music-detail/frequency";
import ShowComp from "./pages/music-detail/compare";
import DetailPage from "./pages/music-detail/detail";
import Folder from "./pages/music-detail/folder";
import Centroid_Rolloff from "./pages/music-detail/centroid_rolloff";
import Flatness from "./pages/music-detail/flatness";
import Decibel from "./pages/music-detail/decibel";
import Pich from "./pages/music-detail/folder_detail/pich";
import Volume from "./pages/music-detail/folder_detail/volume";
import Tone from "./pages/music-detail/folder_detail/tone";
import { useAuth0 } from "@auth0/auth0-react";
import { useFetch_get } from "./pages/root/index";

const App = () => {
  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
  } = useAuth0();
  //useFetch_get(`${process.env.REACT_APP_API_ENDPOINT}/users`);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isAuthenticated) {
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
            <Route path="/folder/:folderId" component={Folder} />
            <Route
              path="/spectrum_centroid_and_rolloff/:musicId"
              component={Centroid_Rolloff}
            />
            <Route path="/flatness/:musicId" component={Flatness} />
            <Route path="/decibel/:musicId" component={Decibel} />
            <Route path="/folder_pich/:folderID" component={Pich} />
            <Route path="/folder_volume/:folderID" component={Volume} />
            <Route path="/folder_tone/:folderID" component={Tone} />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    );
  } else {
    return <button onClick={loginWithRedirect}>Log in</button>;
  }
};

export default App;
