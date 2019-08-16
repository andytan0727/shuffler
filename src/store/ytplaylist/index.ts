import { all } from "redux-saga/effects";

import filteredSagas from "./filteredSagas";
import listToPlaySagas from "./listToPlaySagas";
import playlistSagas from "./playlistSagas";
import videoSagas from "./videoSagas";

// composing sagas
export function* ytplaylistNormedSagas() {
  yield all([
    filteredSagas(),
    listToPlaySagas(),
    playlistSagas(),
    videoSagas(),
  ]);
}

export { ytplaylistNormed } from "./normReducer";
