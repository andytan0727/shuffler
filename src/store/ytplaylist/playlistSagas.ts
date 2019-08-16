import { all, put, select, take, takeEvery } from "redux-saga/effects";
import { AppState } from "store";
import { ActionType } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import * as listToPlayActions from "./listToPlayActions";
import {
  selectNormListToPlayPlaylistItems,
  selectNormListToPlayResult,
} from "./listToPlaySelectors";
import * as playlistActions from "./playlistActions";
import { selectNormPlaylistItemIdsByPlaylistId } from "./playlistSelectors";
import {
  NormListToPlayPlaylistItemsEntity,
  NormListToPlayResultItem,
} from "./types";

/**
 * Saga which watching for DELETE_NORM_PLAYLIST_BY_ID action.
 * If triggered, it dispatches action to delete items from
 * listToPlay (if applicable)
 *
 */
export function* deleteNormPlaylistByIdWatcher() {
  yield takeEvery(
    ActionTypes.DELETE_NORM_PLAYLIST_BY_ID,

    function*(
      action: ActionType<typeof playlistActions.deleteNormPlaylistByIdAction>
    ) {
      const { id: playlistId } = action.payload;
      const listToPlayResultItems: NormListToPlayResultItem[] = yield select(
        selectNormListToPlayResult
      );
      const listToPlayPlaylistItems: NormListToPlayPlaylistItemsEntity = yield select(
        selectNormListToPlayPlaylistItems
      );
      const itemIdsOfItemsToDelete: string[] = [];

      for (const { id: itemId, schema } of listToPlayResultItems) {
        if (schema !== "playlistItems") continue;

        if (listToPlayPlaylistItems[itemId].foreignKey === playlistId) {
          itemIdsOfItemsToDelete.push(itemId);
        }
      }

      if (itemIdsOfItemsToDelete.length !== 0)
        yield put(
          listToPlayActions.deleteNormListToPlayItemsAction(
            itemIdsOfItemsToDelete
          )
        );
    }
  );
}

/**
 * Saga which watching for DELETE_NORM_PLAYLIST_ITEM_BY_ID action.
 * If triggered, it dispatch an action to delete the respective playlist item from
 * normListToPlay (if exists) as well
 *
 */
export function* deleteNormPlaylistItemByIdWatcher() {
  yield takeEvery(ActionTypes.DELETE_NORM_PLAYLIST_ITEM_BY_ID, function*(
    action: ActionType<typeof playlistActions.deleteNormPlaylistItemByIdAction>
  ) {
    const {
      payload: { itemId },
    } = action;

    // remove item from normalized listToPlay as well after the playlist item was deleted
    yield put(listToPlayActions.deleteNormListToPlayItemByIdAction(itemId));
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
    action: ActionType<
      typeof playlistActions.addNormPlaylistToNormListToPlayAction
    >
  ) {
    const {
      payload: { playlistId },
    } = action;

    const itemIds: string[] = yield select((state: AppState) =>
      selectNormPlaylistItemIdsByPlaylistId(state, playlistId)
    );

    // add allInPlaying label to this playlist
    yield put(playlistActions.addAllInPlayingLabelByIdAction(playlistId));

    const playlistItems = itemIds.map((itemId) => ({
      resultItem: {
        id: itemId,
        schema: "playlistItems" as SchemaType,
      },
      foreignKey: playlistId,
    }));

    // add all items in the playlist into normListToPlay
    yield put(listToPlayActions.addNormListToPlayItemsAction(playlistItems));
  });
}

/**
 * Saga that watching for REMOVE_NORM_PLAYLIST_FROM_NORM_LIST_TO_PLAY action.
 * If triggered, it dispatch an action to remove allInPlaying label from playlist,
 * and dispatch an action to remove playlist items
 * from normalized listToPlay
 *
 */
export function* removeNormPlaylistFromNormListToPlayWatcher() {
  yield takeEvery(
    ActionTypes.REMOVE_NORM_PLAYLIST_FROM_NORM_LIST_TO_PLAY,
    function*(
      action: ActionType<
        typeof playlistActions.removeNormPlaylistFromNormListToPlayAction
      >
    ) {
      const {
        payload: { playlistId },
      } = action;

      const itemIds: string[] = yield select((state: AppState) =>
        selectNormPlaylistItemIdsByPlaylistId(state, playlistId)
      );

      // remove allInPlaying label
      yield put(playlistActions.removeAllInPlayingLabelByIdAction(playlistId));

      // remove all items from normListToPlay
      yield put(listToPlayActions.deleteNormListToPlayItemsAction(itemIds));
    }
  );
}

/**
 * Saga which watching for REMOVE_NORM_PLAYLISTS_FROM_NORM_LIST_TO_PLAY action.
 *
 * If triggered, it dispatches multiple REMOVE_NORM_PLAYLIST_FROM_NORM_LIST_TO_PLAY actions
 * according to how many playlistIds.
 *
 */
export function* removeNormPlaylistsFromNormListToPlayWatcher() {
  while (true) {
    const {
      payload: { playlistIds },
    }: ActionType<
      typeof playlistActions.removeNormPlaylistsFromNormListToPlayAction
    > = yield take(ActionTypes.REMOVE_NORM_PLAYLISTS_FROM_NORM_LIST_TO_PLAY);

    for (const playlistId of playlistIds) {
      yield put(
        playlistActions.removeNormPlaylistFromNormListToPlayAction(playlistId)
      );
    }
  }
}

export default function* playlistSagas() {
  yield all([
    deleteNormPlaylistByIdWatcher(),
    deleteNormPlaylistItemByIdWatcher(),
    addNormPlaylistToNormListToPlayWatcher(),
    removeNormPlaylistFromNormListToPlayWatcher(),
    removeNormPlaylistsFromNormListToPlayWatcher(),
  ]);
}
