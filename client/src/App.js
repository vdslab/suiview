import { Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useAuth0 } from "@auth0/auth0-react";

import {
  Home,
  Recording,
  Setting,
  MusicList,
  Folder,
  Detail,
  SelectFolder,
} from "../src/pages";

const App = () => {
  const { isLoading, isAuthenticated, error, loginWithRedirect } = useAuth0();

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
            <Route path="/recording" component={Recording} />
            <Route path="/setting" component={Setting} />
            <Route path="/musics" component={MusicList} />
            <Route path="/folder/:folderId" component={Folder} />
            <Route path="/detail/:musicId" component={Detail} />
            <Route path="/select_folder/:musicId" component={SelectFolder} />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    );
  } else {
    return <button onClick={loginWithRedirect}>Log in</button>;
  }
};

export default App;
