import { applyMiddleware, createStore, combineReducers } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";

// Reducers
import { ytplayer } from "./ytplayer/reducer";

const logger = createLogger();

const rootReducer = combineReducers({
  ytplayer
});

const store =
  process.env.NODE_ENV === "development"
    ? createStore(
        rootReducer,
        composeWithDevTools(applyMiddleware(thunk, logger))
      )
    : createStore(rootReducer, applyMiddleware(thunk));

export default store;
