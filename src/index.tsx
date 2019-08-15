import "./index.scss";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// MUI styles
import CssBaseline from "@material-ui/core/CssBaseline";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import store, { persistor } from "./store";

ReactDOM.render(
  <Provider store={store}>
    <CssBaseline />
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
