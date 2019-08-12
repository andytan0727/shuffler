import { setAutoFreeze } from "immer";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import thunk from "redux-thunk";
import { StateType } from "typesafe-actions";

// Reducers
import { appGeneral as appGeneralReducer } from "./appGeneral/reducer";
import { userPreferences as userPreferencesReducer } from "./userPreferences/reducer";
import userPreferencesSaga from "./userPreferences/sagas";
import { ytapi as ytapiReducer } from "./ytapi/reducer";
// sagas
import ytapiSaga from "./ytapi/sagas";
import { ytplayer as ytplayerReducer } from "./ytplayer/reducer";
import {
  ytplaylist as ytplaylistReducer,
  ytplaylistNormed as ytplaylistNormedReducer,
  ytplaylistNormedSaga,
  ytplaylistSaga,
} from "./ytplaylist";

// Disable immer auto freezing
// To solve the problem of redux-persist _persist object is not extensible
setAutoFreeze(false);

function* rootSaga() {
  yield all([
    ytapiSaga(),
    userPreferencesSaga(),
    ytplaylistSaga(),
    ytplaylistNormedSaga(),
  ]);
}

const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["userPreferences"],
};

const ytplayerPersistConfig = {
  key: "ytplayer",
  storage,
  whitelist: ["repeat"],
};

const ytplaylistPersistConfig = {
  key: "ytplaylist",
  storage,
  blacklist: ["checkedPlaylists", "checkedVideos"],
};

const ytplaylistNormedPersistConfig = {
  key: "ytplaylistNormed",
  storage,
};

const sagaMiddleware = createSagaMiddleware();

const logger = createLogger();

const rootReducer = combineReducers({
  appGeneral: appGeneralReducer,
  userPreferences: userPreferencesReducer,
  ytapi: ytapiReducer,
  ytplayer: persistReducer(ytplayerPersistConfig, ytplayerReducer),
  ytplaylist: persistReducer(ytplaylistPersistConfig, ytplaylistReducer),
  ytplaylistNormed: persistReducer(
    ytplaylistNormedPersistConfig,
    ytplaylistNormedReducer
  ),
});

export const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const store =
  process.env.NODE_ENV === "development"
    ? createStore(
        persistedReducer,
        composeWithDevTools(applyMiddleware(thunk, sagaMiddleware, logger))
      )
    : createStore(
        persistedReducer,
        compose(applyMiddleware(sagaMiddleware, thunk))
      );

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
export type AppState = StateType<typeof rootReducer>;
export default store;
