import { Route } from "react-router-dom";
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
} from "../src/pages";

const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <IonApp>
      <IonReactRouter>
        {isAuthenticated ? (
          <IonRouterOutlet>
            <Route path="/" component={Home} exact />
            <Route path="/recording" component={Recording} />
            <Route path="/setting" component={Setting} />
            <Route path="/musics" component={MusicList} />
            <Route path="/folder/:folderId" component={Folder} />
            <Route path="/detail/:musicId" component={Detail} />
            <Route path="/select_folder/:musicId" component={SelectFolder} />
          </IonRouterOutlet>
        ) : (
          <Login />
        )}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
