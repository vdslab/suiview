import "bulma/css/bulma.css";
import { render } from "react-dom";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import resources from "./translation.js";

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  lang: "ja",
  fallbackLng: "en",
});

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
