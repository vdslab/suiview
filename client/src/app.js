import React from "react";
import { Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import { useAuth0 } from "@auth0/auth0-react";
import Home from "../src/pages/root/home";
import Recording from "../src/pages/recording";
import Setting from "../src/pages/setting";
import Fol from "../src/pages/folder";
import Detail from "../src/pages/detail";
import SelectFolder from "../src/pages/select-folder";

const App = () => {
  const { isLoading, isAuthenticated, error, loginWithRedirect } = useAuth0();
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
            <Route path="/" component={Home} exact />
            <Route path="/recording/:foldername" component={Recording} />
            <Route path="/setting" component={Setting} />
            <Route path="/folder/:foldername" component={Fol} />
            <Route path="/detail/:musicId/from/:folderId" component={Detail} />
            <Route
              path="/select_folder/:musicId/folder/:folderId/from/:path"
              component={SelectFolder}
            />

            {/*<Route path="/musics/:musicId" component={MusicDetail} />
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
    <Route path="/folder_tone/:folderID" component={Tone} />*/}
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    );
  } else {
    return <button onClick={loginWithRedirect}>Log in</button>;
  }
};

export default App;
