import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Imageprovider from "./Components/Context/imagesContext";
import "./i18n";
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <Imageprovider>
          <App />
          <ToastContainer position="top-center" />
        </Imageprovider>
      </Provider>
    </GoogleOAuthProvider>
  </>,
);
