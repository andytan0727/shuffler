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
import {
  ADD_PLAYLIST_TO_LIST_TO_PLAY,
  DELETE_PLAYLIST_BY_ID,
  DELETE_PLAYLIST_ITEM_BY_ID,
  DELETE_PLAYLIST_ITEMS_BY_ID,
  REMOVE_PLAYLIST_FROM_LIST_TO_PLAY,
  REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY,
  SYNC_PLAYLIST_FROM_YT_BY_ID,
} from "utils/constants/actionConstants";
import { recursivelyFetchPlaylistData } from "utils/helper/fetchHelper";
import { notify } from "utils/helper/notifyHelper";

import { removeFilteredSnippetsByItemIds } from "./filteredActions";
import { selectFilteredSnippets } from "./filteredSelectors";
import {
  addListToPlayItemsAction,
  deleteListToPlayItemsAction,
} from "./listToPlayActions";
import {
  selectListToPlayPlaylistItems,
  selectListToPlayResult,
} from "./listToPlaySelectors";
import {
  addPlaylistAction,
  addPlaylistToListToPlayAction,
  deletePlaylistByIdAction,
  deletePlaylistItemByIdAction,
  deletePlaylistItemsByIdAction,
  removeAllInPlayingLabelByIdAction,
  removePlaylistFromListToPlayAction,
  removePlaylistsFromListToPlayAction,
  syncPlaylistFromYTByIdAction,
  syncPlaylistFromYTByIdFailedAction,
  syncPlaylistFromYTByIdSuccessAction,
} from "./playlistActions";
import { selectPlaylistItemIdsByPlaylistId } from "./playlistSelectors";
import {
  FetchedPlaylist,
  ListToPlayPlaylistItemsEntity,
  ListToPlayResultItem,
  ListToPlaySnippets,
  PlaylistItem,
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
    yield put(deletePlaylistItemsByIdAction(playlistId, itemIdsToDelete));
  }

  // add newly updated playlist
  yield put(addPlaylistAction(entities, result));

  // dispatch update playlist success action to notify
  // listToPlay's checkIfAllOrPartialPlaylistItemsInPlaying watcher
  // if everything goes well
  yield put(syncPlaylistFromYTByIdSuccessAction(playlistId));

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
    DELETE_PLAYLIST_BY_ID,

    function*(action: ActionType<typeof deletePlaylistByIdAction>) {
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
        yield put(deleteListToPlayItemsAction(itemIdsOfItemsToDelete));
    }
  );
}

/**
 * Saga which watching for actions that delete playlist item(s)
 * i.e. DELETE_PLAYLIST_ITEM(S)_BY_ID
 *
 * If triggered, it dispatch an action to:
 *   - delete the respective playlist item from
 *     listToPlay (if exists) and
 *   - delete filtered snippets if user deletes
 *     playlist item(s) when applying filter
 *
 */
export function* deletePlaylistItemsWatcher() {
  yield takeEvery(
    [DELETE_PLAYLIST_ITEM_BY_ID, DELETE_PLAYLIST_ITEMS_BY_ID],
    function*(
      action: ActionType<
        | typeof deletePlaylistItemByIdAction
        | typeof deletePlaylistItemsByIdAction
      >
    ) {
      const itemIds: string[] = [];

      switch (action.type) {
        case "DELETE_PLAYLIST_ITEM_BY_ID": {
          const { itemId } = action.payload;
          itemIds.push(itemId);
          break;
        }

        case "DELETE_PLAYLIST_ITEMS_BY_ID": {
          const { itemIds: playlistItemIs } = action.payload;
          itemIds.push(...playlistItemIs);
          break;
        }

        default:
          break;
      }

      // remove item from listToPlay as well after the playlist item was deleted
      yield put(deleteListToPlayItemsAction(itemIds));

      // remove playlist items in filtered snippets as well
      // if user is filtering
      const filteredSnippets: ListToPlaySnippets | undefined = yield select(
        selectFilteredSnippets
      );

      if (filteredSnippets) yield put(removeFilteredSnippetsByItemIds(itemIds));
    }
  );
}

/**
 * Saga that watching for ADD_PLAYLIST_TO_LIST_TO_PLAY action.
 * If triggered, it dispatch an action to add playlist items
 * to listToPlay
 *
 */
export function* addPlaylistToListToPlayWatcher() {
  yield takeEvery(ADD_PLAYLIST_TO_LIST_TO_PLAY, function*(
    action: ActionType<typeof addPlaylistToListToPlayAction>
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
    yield put(addListToPlayItemsAction(playlistItems));
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
  yield takeEvery(REMOVE_PLAYLIST_FROM_LIST_TO_PLAY, function*(
    action: ActionType<typeof removePlaylistFromListToPlayAction>
  ) {
    const {
      payload: { playlistId },
    } = action;

    const itemIds: string[] = yield select((state: AppState) =>
      selectPlaylistItemIdsByPlaylistId(state, playlistId)
    );

    // remove allInPlaying label
    yield put(removeAllInPlayingLabelByIdAction(playlistId));

    // remove all items from listToPlay
    yield put(deleteListToPlayItemsAction(itemIds));
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
    }: ActionType<typeof removePlaylistsFromListToPlayAction> = yield take(
      REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY
    );

    for (const playlistId of playlistIds) {
      yield put(removePlaylistFromListToPlayAction(playlistId));
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
    SYNC_PLAYLIST_FROM_YT_BY_ID,

    function*(action: ActionType<typeof syncPlaylistFromYTByIdAction>) {
      const { playlistId } = action.payload;
      const apiKey: string = yield select(selectYTApiKey);
      const baseUrl: string = yield select(selectPlaylistBaseUrl);
      const params: FetchParams = yield select(selectPlaylistParams);

      // delay 950ms to display syncing spinner without flashing
      yield delay(950);

      try {
        const playlistItems: PlaylistItem[] = yield call(
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
        yield put(syncPlaylistFromYTByIdFailedAction());
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
    deletePlaylistItemsWatcher(),
    addPlaylistToListToPlayWatcher(),
    removePlaylistFromListToPlayWatcher(),
    removePlaylistsFromListToPlayWatcher(),
    syncPlaylistFromYTByIdWatcher(),
  ]);
}
