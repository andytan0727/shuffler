import { all } from "redux-saga/effects";

import filteredSaga from "./filteredSagas";
import normedSaga from "./normSagas";

// composing sagas
export function* ytplaylistNormedSaga() {
  yield all([normedSaga(), filteredSaga()]);
}

export { ytplaylist } from "./reducer";
export { ytplaylistNormed } from "./normReducer";
