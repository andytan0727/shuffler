import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
import { hydrateRedux } from "./utils/helper/hydrateReduxHelper";
import "./index.scss";

// MUI styles
import CssBaseline from "@material-ui/core/CssBaseline";

import * as serviceWorker from "./serviceWorker";

// Hydrate Redux if data is persisted to indexedDB before
hydrateRedux(store);

ReactDOM.render(
  <Provider store={store}>
    <CssBaseline />
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
