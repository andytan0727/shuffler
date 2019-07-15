import { applyMiddleware, createStore, combineReducers, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import { setAutoFreeze } from "immer";

// Reducers
import { appGeneral as appGeneralReducer } from "./appGeneral/reducer";
import { userPreferences as userPreferencesReducer } from "./userPreferences/reducer";
import { ytapi as ytapiReducer } from "./ytapi/reducer";
import { ytplayer as ytplayerReducer } from "./ytplayer/reducer";
import {
  ytplaylist as ytplaylistReducer,
  ytplaylistNormalized as ytplaylistNormalizedReducer,
} from "./ytplaylist";

// sagas
import ytapiSaga from "./ytapi/sagas";
import ytplaylistSaga from "./ytplaylist/sagas";
import userPreferencesSaga from "./userPreferences/sagas";

// Disable immer auto freezing
// To solve the problem of redux-persist _persist object is not extensible
setAutoFreeze(false);

function* rootSaga() {
  yield all([ytapiSaga(), ytplaylistSaga(), userPreferencesSaga()]);
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

const sagaMiddleware = createSagaMiddleware();

const logger = createLogger();

const rootReducer = combineReducers({
  appGeneral: appGeneralReducer,
  userPreferences: userPreferencesReducer,
  ytapi: ytapiReducer,
  ytplayer: persistReducer(ytplayerPersistConfig, ytplayerReducer),
  ytplaylist: persistReducer(ytplaylistPersistConfig, ytplaylistReducer),
  ytplaylistNormalized: ytplaylistNormalizedReducer,
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
export type AppState = ReturnType<typeof rootReducer>;
export default store;
