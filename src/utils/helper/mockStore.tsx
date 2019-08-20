import React from "react";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "store";
import { appGeneral as appGeneralReducer } from "store/appGeneral/reducer";
import { userPreferences as userPreferencesReducer } from "store/userPreferences/reducer";
import { ytapi as ytapiReducer } from "store/ytapi/reducer";
import { ytplayer as ytplayerReducer } from "store/ytplayer/reducer";
import { ytplaylistReducer } from "store/ytplaylist";

import { render } from "@testing-library/react";

export const generateMockStore = (initialState = {}) => {
  const rootReducer = combineReducers({
    appGeneral: appGeneralReducer,
    userPreferences: userPreferencesReducer,
    ytapi: ytapiReducer,
    ytplayer: ytplayerReducer,
    ytplaylist: ytplaylistReducer,
  });

  const sagaMiddleware = createSagaMiddleware();

  const defaultStore = createStore(
    rootReducer,
    initialState,
    applyMiddleware(sagaMiddleware)
  );

  sagaMiddleware.run(rootSaga);

  return defaultStore;
};

export const renderWithRedux = (
  component: React.ReactElement,
  store = generateMockStore()
) => {
  const ReduxStoreWrappedComponent = (
    <Provider store={store}>{component}</Provider>
  );

  return {
    ...render(ReduxStoreWrappedComponent),
    ReduxStoreWrappedComponent,
  };
};
