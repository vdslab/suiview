import { Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useAuth0 } from "@auth0/auth0-react";

import Home from "../src/pages/Home";
import Recording from "../src/pages/Recording";
import Setting from "../src/pages/Setting";
import Folder from "../src/pages/Folder";
import Detail from "../src/pages/Detail";
import SelectFolder from "../src/pages/SelectFolder";

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
            <Route path="/recording/:folderId" component={Recording} />
            <Route path="/setting" component={Setting} />
            <Route path="/folder/:folderId" component={Folder} />
            <Route path="/detail/:musicId/from/:folderId" component={Detail} />
            <Route
              path="/select_folder/:musicId/folder/:folderId/from/:path"
              component={SelectFolder}
            />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    );
  } else {
    return <button onClick={loginWithRedirect}>Log in</button>;
  }
};

export default App;
