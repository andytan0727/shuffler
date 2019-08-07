import { all, put, take } from "redux-saga/effects";
import { ActionType } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import {
  addAllInPlayingLabelByIdAction,
  addNormListToPlayItemAction,
  addNormPlaylistToNormListToPlayAction,
  deleteNormListToPlayItemByIdAction,
  deleteNormPlaylistItemByIdAction,
  deleteNormVideoByIdAction,
  removeAllInPlayingLabelByIdAction,
  removeNormPlaylistFromNormListToPlayAction,
} from "./normAction";

/**
 * Saga which watching for DELETE_NORM_VIDEO_BY_ID action.
 * If triggered, it dispatch an action to delete the respective video item from
 * normListToPlay (if exists) as well
 *
 */
export function* deleteNormVideoByIdWatcher() {
  while (true) {
    const {
      payload: { id },
    }: ActionType<typeof deleteNormVideoByIdAction> = yield take(
      ActionTypes.DELETE_NORM_VIDEO_BY_ID
    );

    // remove item from normalized listToPlay videoItems
    yield put(deleteNormListToPlayItemByIdAction(id));
  }
}

/**
 * Saga which watching for DELETE_NORM_PLAYLIST_ITEM_BY_ID action.
 * If triggered, it dispatch an action to delete the respective playlist item from
 * normListToPlay (if exists) as well
 *
 */
export function* deleteNormPlaylistItemByIdWatcher() {
  while (true) {
    const {
      payload: { itemId },
    }: ActionType<typeof deleteNormPlaylistItemByIdAction> = yield take(
      ActionTypes.DELETE_NORM_PLAYLIST_ITEM_BY_ID
    );

    // remove item from normalized listToPlay playlistItems
    yield put(deleteNormListToPlayItemByIdAction(itemId));
  }
}

/**
 * Saga that watching for ADD_NORM_PLAYLIST_TO_NORM_LIST_TO_PLAY action.
 * If triggered, it dispatch an action to add allInPlaying label to playlist,
 * and dispatch an action to add playlist items
 * to normalized listToPlay
 *
 */
export function* addNormPlaylistToNormListToPlayWatcher() {
  while (true) {
    const {
      payload: { playlistId, itemIds },
    }: ActionType<typeof addNormPlaylistToNormListToPlayAction> = yield take(
      ActionTypes.ADD_NORM_PLAYLIST_TO_NORM_LIST_TO_PLAY
    );

    // add allInPlaying label to this playlist
    yield put(addAllInPlayingLabelByIdAction(playlistId));

    // add all items in the playlist into normListToPlay
    for (const itemId of itemIds) {
      yield put(
        addNormListToPlayItemAction(
          {
            id: itemId,
            source: "playlists",
            schema: "playlistItems",
          },
          playlistId
        )
      );
    }
  }
}

/**
 * Saga that watching for REMOVE_NORM_PLAYLIST_TO_NORM_LIST_TO_PLAY action.
 * If triggered, it dispatch an action to remove allInPlaying label from playlist,
 * and dispatch an action to remove playlist items
 * from normalized listToPlay
 *
 */
export function* removeNormPlaylistFromNormListToPlayWatcher() {
  while (true) {
    const {
      payload: { playlistId, itemIds },
    }: ActionType<
      typeof removeNormPlaylistFromNormListToPlayAction
    > = yield take(ActionTypes.REMOVE_NORM_PLAYLIST_FROM_NORM_LIST_TO_PLAY);

    // remove allInPlaying label
    yield put(removeAllInPlayingLabelByIdAction(playlistId));

    // remove all items from normListToPlay
    for (const itemId of itemIds) {
      yield put(deleteNormListToPlayItemByIdAction(itemId));
    }
  }
}

export default function* ytplaylistNormedSaga() {
  yield all([
    deleteNormVideoByIdWatcher(),
    deleteNormPlaylistItemByIdWatcher(),
    addNormPlaylistToNormListToPlayWatcher(),
    removeNormPlaylistFromNormListToPlayWatcher(),
  ]);
}
