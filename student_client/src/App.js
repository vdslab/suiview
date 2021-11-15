import { useEffect } from "react";
import { Route, useLocation } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useAuth0 } from "@auth0/auth0-react";
import ReactGA from "react-ga";
import {
  Home,
  Login,
  Recording,
  Setting,
  MusicList,
  Folder,
  Detail,
  SelectFolder,
  Guide,
} from "../src/pages";
import "./theme/variables.css";

ReactGA.initialize("G-YHK6XHHLTE");

const Tracker = ({ children }) => {
  const location = useLocation();
  useEffect(() => {
    ReactGA.pageview(location.pathname);
  }, [location.pathname]);
  return <>{children}</>;
};

const App = () => {
  const { isAuthenticated } = useAuth0();
  //console.log("visited" in localStorage);
  return (
    <IonApp>
      <IonReactRouter>
        <Tracker>
          {isAuthenticated ? (
            <IonRouterOutlet>
              <Route path="/home" component={Home} exact />
              <Route path="/" component={Home} exact />
              <Route path="/setting/gaido" component={Guide} />
              <Route path="/recording" component={Recording} />
              <Route path="/setting" component={Setting} exact />
              <Route path="/musics" component={MusicList} />
              <Route path="/folder/:folderId" component={Folder} />
              <Route path="/detail/:musicId" component={Detail} />
              <Route path="/select_folder/:musicId" component={SelectFolder} />
            </IonRouterOutlet>
          ) : (
            <Login />
          )}
        </Tracker>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
