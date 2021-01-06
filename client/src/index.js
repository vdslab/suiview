import "@ionic/core/css/core.css";
import "@ionic/core/css/ionic.bundle.css";
import "./index.css";

import { render } from "react-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration.js";

render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    redirectUri={window.location.origin}
    audience={process.env.REACT_APP_AUTH0_AUDIENCE}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("content"),
);

serviceWorkerRegistration.register();
