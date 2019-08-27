import difference from "lodash/difference";
import {
  all,
  call,
  delay,
  put,
  select,
  take,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import { normalizePlaylists } from "schemas";
import { AppState } from "store";
import {
  selectPlaylistBaseUrl,
  selectPlaylistParams,
  selectYTApiKey,
} from "store/ytapi/selectors";
import { ActionType } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";
import { recursivelyFetchPlaylistData } from "utils/helper/fetchHelper";
import { notify } from "utils/helper/notifyHelper";

import * as listToPlayActions from "./listToPlayActions";
import {
  selectListToPlayPlaylistItems,
  selectListToPlayResult,
} from "./listToPlaySelectors";
import * as playlistActions from "./playlistActions";
import { selectPlaylistItemIdsByPlaylistId } from "./playlistSelectors";
import {
  FetchedPlaylist,
  ListToPlayPlaylistItemsEntity,
  ListToPlayResultItem,
  PlaylistsEntities,
} from "./types";

// ===============================================
// Helpers
// ===============================================
export function* syncPlaylistFromYTByIdSuccess(
  entities: PlaylistsEntities,
  result: string[]
) {
  if (result.length > 1)
    throw new Error("There should be only one playlist update at one time.");

  if (result.length === 0) throw new Error("No playlist found to update");

  const playlistId = result[0];
  const prevPlaylistItemIds: string[] = yield select((state: AppState) =>
    selectPlaylistItemIdsByPlaylistId(state, playlistId)
  );
  const curPlaylistItemIds = entities.playlists[playlistId].items;
  const itemIdsToDelete = difference(prevPlaylistItemIds, curPlaylistItemIds);

  // Delete unwanted prev playlistItem if exists.
  // Also automatically update listToPlay
  // by deletePlaylistItemByIdWatcher
  if (itemIdsToDelete.length !== 0) {
    for (const itemId of itemIdsToDelete) {
      yield put(
        playlistActions.deletePlaylistItemByIdAction(playlistId, itemId)
      );
    }
  }

  // add newly updated playlist
  yield put(playlistActions.addPlaylistAction(entities, result));

  // dispatch update playlist success action to notify
  // listToPlay's checkIfAllOrPartialPlaylistItemsInPlaying watcher
  // if everything goes well
  yield put(playlistActions.syncPlaylistFromYTByIdSuccessAction(playlistId));

  notify("success", "Successfully synced your playlist with YouTube.");
}
// ===============================================
// End Helpers
// ===============================================

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

/**
 * Saga which watching for SYNC_PLAYLIST_FROM_YT_BY_ID action.
 *
 * If triggered, it fetches latest data from YouTube and
 * calls syncPlaylistFromYTById helper if successfully fetched,
 * else dispatches SYNC_PLAYLIST_FROM_YT_BY_ID_FAILED action
 * to notify user that update is failed
 *
 */
export function* syncPlaylistFromYTByIdWatcher() {
  yield takeLatest(
    ActionTypes.SYNC_PLAYLIST_FROM_YT_BY_ID,

    function*(
      action: ActionType<typeof playlistActions.syncPlaylistFromYTByIdAction>
    ) {
      const { playlistId } = action.payload;
      const apiKey: string = yield select(selectYTApiKey);
      const baseUrl: string = yield select(selectPlaylistBaseUrl);
      const params: FetchParams = yield select(selectPlaylistParams);

      // delay 950ms to display syncing spinner without flashing
      yield delay(950);

      try {
        const playlistItems = yield call(
          recursivelyFetchPlaylistData,
          baseUrl,
          {
            ...params,
            apiKey,
            playlistId,
          }
        );
        const fetchedPlaylist: FetchedPlaylist = {
          id: playlistId,
          items: playlistItems,
        };

        const { entities, result } = normalizePlaylists([fetchedPlaylist]);

        yield call(syncPlaylistFromYTByIdSuccess, entities, result);
      } catch (err) {
        yield put(playlistActions.syncPlaylistFromYTByIdFailedAction());
        notify(
          "error",
          "Unable to sync your playlist. Please try again later."
        );
      }
    }
  );
}

export default function* playlistSagas() {
  yield all([
    deletePlaylistByIdWatcher(),
    deletePlaylistItemByIdWatcher(),
    addPlaylistToListToPlayWatcher(),
    removePlaylistFromListToPlayWatcher(),
    removePlaylistsFromListToPlayWatcher(),
    syncPlaylistFromYTByIdWatcher(),
  ]);
}
