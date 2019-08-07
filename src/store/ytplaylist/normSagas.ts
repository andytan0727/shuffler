import { all, put, take } from "redux-saga/effects";
import { ActionType } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import {
  deleteNormListToPlayItemByIdAction,
  deleteNormPlaylistItemByIdAction,
  deleteNormVideoByIdAction,
} from "./normAction";

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

export function* deleteNormPlaylistItemByIdWatcher() {
  const {
    payload: { itemId },
  }: ActionType<typeof deleteNormPlaylistItemByIdAction> = yield take(
    ActionTypes.DELETE_NORM_PLAYLIST_ITEM_BY_ID
  );

  // remove item from normalized listToPlay playlistItems
  yield put(deleteNormListToPlayItemByIdAction(itemId));
}

export default function* ytplaylistNormedSaga() {
  yield all([
    deleteNormVideoByIdWatcher(),
    deleteNormPlaylistItemByIdWatcher(),
  ]);
}
