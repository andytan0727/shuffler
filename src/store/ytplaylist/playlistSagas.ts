import { all, put, select, take, takeEvery } from "redux-saga/effects";
import { AppState } from "store";
import { ActionType } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import * as listToPlayActions from "./listToPlayActions";
import {
  selectListToPlayPlaylistItems,
  selectListToPlayResult,
} from "./listToPlaySelectors";
import * as playlistActions from "./playlistActions";
import { selectPlaylistItemIdsByPlaylistId } from "./playlistSelectors";
import { ListToPlayPlaylistItemsEntity, ListToPlayResultItem } from "./types";

/**
 * Saga which watching for DELETE_PLAYLIST_BY_ID action.
 * If triggered, it dispatches action to delete items from
 * listToPlay (if applicable)
 *
 */
export function* deletePlaylistByIdWatcher() {
  yield takeEvery(
    ActionTypes.DELETE_PLAYLIST_BY_ID,

    function*(
      action: ActionType<typeof playlistActions.deletePlaylistByIdAction>
    ) {
      const { id: playlistId } = action.payload;
      const listToPlayResultItems: ListToPlayResultItem[] = yield select(
        selectListToPlayResult
      );
      const listToPlayPlaylistItems: ListToPlayPlaylistItemsEntity = yield select(
        selectListToPlayPlaylistItems
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
          listToPlayActions.deleteListToPlayItemsAction(itemIdsOfItemsToDelete)
        );
    }
  );
}

/**
 * Saga which watching for DELETE_PLAYLIST_ITEM_BY_ID action.
 * If triggered, it dispatch an action to delete the respective playlist item from
 * listToPlay (if exists) as well
 *
 */
export function* deletePlaylistItemByIdWatcher() {
  yield takeEvery(ActionTypes.DELETE_PLAYLIST_ITEM_BY_ID, function*(
    action: ActionType<typeof playlistActions.deletePlaylistItemByIdAction>
  ) {
    const {
      payload: { itemId },
    } = action;

    // remove item from listToPlay as well after the playlist item was deleted
    yield put(listToPlayActions.deleteListToPlayItemByIdAction(itemId));
  });
}

/**
 * Saga that watching for ADD_PLAYLIST_TO_LIST_TO_PLAY action.
 * If triggered, it dispatch an action to add playlist items
 * to listToPlay
 *
 */
export function* addPlaylistToListToPlayWatcher() {
  yield takeEvery(ActionTypes.ADD_PLAYLIST_TO_LIST_TO_PLAY, function*(
    action: ActionType<typeof playlistActions.addPlaylistToListToPlayAction>
  ) {
    const {
      payload: { playlistId },
    } = action;

    const itemIds: string[] = yield select((state: AppState) =>
      selectPlaylistItemIdsByPlaylistId(state, playlistId)
    );

    const playlistItems = itemIds.map((itemId) => ({
      resultItem: {
        id: itemId,
        schema: "playlistItems" as SchemaType,
      },
      foreignKey: playlistId,
    }));

    // add all items in the playlist into listToPlay
    yield put(listToPlayActions.addListToPlayItemsAction(playlistItems));
  });
}

/**
 * Saga that watching for REMOVE_PLAYLIST_FROM_LIST_TO_PLAY action.
 * If triggered, it dispatch an action to remove allInPlaying label from playlist,
 * and dispatch an action to remove playlist items
 * from listToPlay
 *
 */
export function* removePlaylistFromListToPlayWatcher() {
  yield takeEvery(ActionTypes.REMOVE_PLAYLIST_FROM_LIST_TO_PLAY, function*(
    action: ActionType<
      typeof playlistActions.removePlaylistFromListToPlayAction
    >
  ) {
    const {
      payload: { playlistId },
    } = action;

    const itemIds: string[] = yield select((state: AppState) =>
      selectPlaylistItemIdsByPlaylistId(state, playlistId)
    );

    // remove allInPlaying label
    yield put(playlistActions.removeAllInPlayingLabelByIdAction(playlistId));

    // remove all items from listToPlay
    yield put(listToPlayActions.deleteListToPlayItemsAction(itemIds));
  });
}

/**
 * Saga which watching for REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY action.
 *
 * If triggered, it dispatches multiple REMOVE_PLAYLIST_FROM_LIST_TO_PLAY actions
 * according to how many playlistIds.
 *
 */
export function* removePlaylistsFromListToPlayWatcher() {
  while (true) {
    const {
      payload: { playlistIds },
    }: ActionType<
      typeof playlistActions.removePlaylistsFromListToPlayAction
    > = yield take(ActionTypes.REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY);

    for (const playlistId of playlistIds) {
      yield put(playlistActions.removePlaylistFromListToPlayAction(playlistId));
    }
  }
}

export default function* playlistSagas() {
  yield all([
    deletePlaylistByIdWatcher(),
    deletePlaylistItemByIdWatcher(),
    addPlaylistToListToPlayWatcher(),
    removePlaylistFromListToPlayWatcher(),
    removePlaylistsFromListToPlayWatcher(),
  ]);
}
