import { all, put, takeEvery } from "redux-saga/effects";
import { ActionType } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import {
  addAllInPlayingLabelByIdAction,
  addNormListToPlayItemAction,
  addNormPlaylistToNormListToPlayAction,
  deleteNormListToPlayItemByIdAction,
  deleteNormListToPlayItemsAction,
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
  yield takeEvery(ActionTypes.DELETE_NORM_VIDEO_BY_ID, function*(
    action: ActionType<typeof deleteNormVideoByIdAction>
  ) {
    const {
      payload: { id },
    } = action;

    // remove item from normalized listToPlay videoItems
    yield put(deleteNormListToPlayItemByIdAction(id));
  });
}

/**
 * Saga which watching for DELETE_NORM_PLAYLIST_ITEM_BY_ID action.
 * If triggered, it dispatch an action to delete the respective playlist item from
 * normListToPlay (if exists) as well
 *
 */
export function* deleteNormPlaylistItemByIdWatcher() {
  yield takeEvery(ActionTypes.DELETE_NORM_PLAYLIST_ITEM_BY_ID, function*(
    action: ActionType<typeof deleteNormPlaylistItemByIdAction>
  ) {
    const {
      payload: { itemId },
    } = action;

    // remove item from normalized listToPlay playlistItems
    yield put(deleteNormListToPlayItemByIdAction(itemId));
  });
}

/**
 * Saga that watching for ADD_NORM_PLAYLIST_TO_NORM_LIST_TO_PLAY action.
 * If triggered, it dispatch an action to add allInPlaying label to playlist,
 * and dispatch an action to add playlist items
 * to normalized listToPlay
 *
 */
export function* addNormPlaylistToNormListToPlayWatcher() {
  yield takeEvery(ActionTypes.ADD_NORM_PLAYLIST_TO_NORM_LIST_TO_PLAY, function*(
    action: ActionType<typeof addNormPlaylistToNormListToPlayAction>
  ) {
    const {
      payload: { playlistId, itemIds },
    } = action;

    // add allInPlaying label to this playlist
    yield put(addAllInPlayingLabelByIdAction(playlistId));

    // add all items in the playlist into normListToPlay
    // TODO: move loop to reducers
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
  });
}

/**
 * Saga that watching for REMOVE_NORM_PLAYLIST_TO_NORM_LIST_TO_PLAY action.
 * If triggered, it dispatch an action to remove allInPlaying label from playlist,
 * and dispatch an action to remove playlist items
 * from normalized listToPlay
 *
 */
export function* removeNormPlaylistFromNormListToPlayWatcher() {
  yield takeEvery(
    ActionTypes.REMOVE_NORM_PLAYLIST_FROM_NORM_LIST_TO_PLAY,
    function*(
      action: ActionType<typeof removeNormPlaylistFromNormListToPlayAction>
    ) {
      const {
        payload: { playlistId, itemIds },
      } = action;

      // remove allInPlaying label
      yield put(removeAllInPlayingLabelByIdAction(playlistId));

      // remove all items from normListToPlay
      yield put(deleteNormListToPlayItemsAction(itemIds));
    }
  );
}

export default function* ytplaylistNormedSaga() {
  yield all([
    deleteNormVideoByIdWatcher(),
    deleteNormPlaylistItemByIdWatcher(),
    addNormPlaylistToNormListToPlayWatcher(),
    removeNormPlaylistFromNormListToPlayWatcher(),
  ]);
}
