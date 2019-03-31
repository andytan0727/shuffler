import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
import { hydrateRedux } from "./utils/helper/hydrateReduxHelper";
import "./index.scss";

// MUI styles
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import CssBaseline from "@material-ui/core/CssBaseline";

import * as serviceWorker from "./serviceWorker";

const theme = createMuiTheme({
  palette: {
    primary: { main: purple[800] },
    secondary: { main: purple["A200"] },
  },
  typography: { useNextVariants: true },
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <CssBaseline />
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);

// Hydrate Redux if data is persisted to indexedDB before
hydrateRedux(store);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
