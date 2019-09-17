import { combineReducers } from "redux";
import { all } from "redux-saga/effects";

import checkLabelSagas from "./checkLabelSagas";
import { filteredReducer } from "./filteredReducer";
import filteredSagas from "./filteredSagas";
import { listToPlayReducer } from "./listToPlayReducer";
import listToPlaySagas from "./listToPlaySagas";
import { playlistsReducer } from "./playlistReducer";
import playlistSagas from "./playlistSagas";
import { videosReducer } from "./videoReducer";
import videoSagas from "./videoSagas";

// composing sagas
export function* ytplaylistSagas() {
  yield all([
    checkLabelSagas(),
    filteredSagas(),
    listToPlaySagas(),
    playlistSagas(),
    videoSagas(),
  ]);
}

export const ytplaylistReducer = combineReducers({
  playlists: playlistsReducer,
  videos: videosReducer,
  listToPlay: listToPlayReducer,
  filtered: filteredReducer,
});
