import { applyMiddleware, createStore, combineReducers } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";

// Reducers
import { userPreferences } from "./userPreferences/reducer";
import { ytapi } from "./ytapi/reducer";
import { ytplayer } from "./ytplayer/reducer";
import { ytplaylist } from "./ytplaylist/reducer";

const logger = createLogger();

const rootReducer = combineReducers({
  userPreferences,
  ytapi,
  ytplayer,
  ytplaylist,
});

const store =
  process.env.NODE_ENV === "development"
    ? createStore(
        rootReducer,
        composeWithDevTools(applyMiddleware(thunk, logger))
      )
    : createStore(rootReducer, applyMiddleware(thunk));

export default store;
