import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../src/redux/store";
import "./locales/i18n";
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/global.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HelmetProvider>
      <GoogleOAuthProvider clientId="60176889311-345slh8brbtu2s6ct0lvc2f29mb5h66l.apps.googleusercontent.com">
        <BrowserRouter>
          <Suspense>
            <App />
          </Suspense>
        </BrowserRouter>
        </GoogleOAuthProvider>  
      </HelmetProvider>
    </PersistGate>
  </Provider>
);
