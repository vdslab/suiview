import { Route, Redirect } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useAuth0 } from "@auth0/auth0-react";

import {
  Home,
  Login,
  Recording,
  Setting,
  MusicList,
  Folder,
  Detail,
  SelectFolder,
  Gaido,
} from "../src/pages";

const App = () => {
  const { isAuthenticated } = useAuth0();
  console.log("visited" in localStorage);
  return (
    <IonApp>
      <IonReactRouter>
        {isAuthenticated ? (
          <IonRouterOutlet>
            <Route
              path="/home"
              render={() => {
                return "visited" in localStorage ? (
                  <Home />
                ) : (
                  <Gaido modal={true} />
                );
              }}
              exact={true}
            />
            {/*<Route path="/" component={Home} exact />*/}
            <Route path="/setting/gaido" component={Gaido} />
            <Route path="/recording" component={Recording} />
            <Route path="/setting" component={Setting} exact />
            <Route path="/musics" component={MusicList} />
            <Route path="/folder/:folderId" component={Folder} />
            <Route path="/detail/:musicId" component={Detail} />
            <Route path="/select_folder/:musicId" component={SelectFolder} />
            <Route
              path="/"
              render={() => <Redirect to="/home" />}
              exact={true}
            />
          </IonRouterOutlet>
        ) : (
          <Login />
        )}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
