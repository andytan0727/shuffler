import "./index.scss";

import { ErrorBoundary } from "components/ErrorBoundary";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// MUI styles
import CssBaseline from "@material-ui/core/CssBaseline";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import store, { persistor } from "./store";

const rootNode = document.getElementById("root") as Element;

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <CssBaseline />
      <PersistGate loading={null} persistor={persistor}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </PersistGate>
    </Provider>,
    rootNode
  );
};

if ((module as any).hot) {
  (module as any).hot.accept(() => {
    ReactDOM.unmountComponentAtNode(rootNode);
    render();
  });
}

// initial rendering
render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
