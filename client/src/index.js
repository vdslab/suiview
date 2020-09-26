import "@ionic/core/css/core.css";
import "@ionic/core/css/ionic.bundle.css";
import "./index.css";

import React from "react";
import { render } from "react-dom";

import App from "./app";

import { Auth0Provider } from "@auth0/auth0-react";

//orign
//render(<App />, document.getElementById("content"));

render(
  <Auth0Provider
    domain="auth0-react-test.us.auth0.com"
    clientId="bz5xhba5hV2arCSNnSlulrypuPHgTRyd"
    redirectUri={window.location.origin}
  >
    <App />
  </Auth0Provider>,

  //document.getElementById("app")
  document.getElementById("content")
);
