import "bulma/css/bulma.css";
import { render } from "react-dom";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    redirectUri={window.location.origin}
    audience={process.env.REACT_APP_AUTH0_AUDIENCE}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("content")
);

//render(<App />, document.querySelector("#content"));
