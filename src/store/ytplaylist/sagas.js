import { takeEvery, put, all } from "redux-saga/effects";
import { REMOVE_PLAYLISTS } from "../../utils/constants/actionConstants";
import {
  removePlayingPlaylistsAction,
  removeFromListToPlayAction,
  setCheckedPlaylists,
} from "./action";

/**
 * @typedef {Object} RemovePlaylistsType
 * @property {Object} payload
 * @property {Array<string>} payload.playlistIds
 */

/**
 * Saga which listening for REMOVE_PLAYLISTS action,
 * after that, executes REMOVE_PLAYING_PLAYLISTS and
 * REMOVE_FROM_LIST_TO_PLAY actions as well
 *
 * @export
 * @param {RemovePlaylistsType} action
 */
export function* removePlaylists(action) {
  const playlistIdsToRemove = action.payload.playlistIds;

  if (Array.isArray && !Array.isArray(playlistIdsToRemove))
    throw new Error("removePlaylists: Args supplied is not an array");

  yield put(removePlayingPlaylistsAction(playlistIdsToRemove));
  yield put(removeFromListToPlayAction(playlistIdsToRemove, "playlist"));
  yield put(setCheckedPlaylists([])); // clear checkedPlaylists
}

// =========================
// Saga Watchers
// =========================

function* removePlaylistsWatcher() {
  // @ts-ignore
  // ignore vscode implicit checkJs
  // unable to resolve redux-saga typings problem using jsdoc
  yield takeEvery(REMOVE_PLAYLISTS, removePlaylists);
}

export default function* ytplaylistSaga() {
  yield all([removePlaylistsWatcher()]);
}
