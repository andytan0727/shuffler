import cloneDeep from "lodash/cloneDeep";
import map from "lodash/map";
import uniq from "lodash/uniq";
import {
  all,
  call,
  fork,
  put,
  select,
  take,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import { AppState } from "store";
import { ActionType } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import { selectSnippetIdByItemId } from "./generalSelectors";
import * as listToPlayActions from "./listToPlayActions";
import {
  selectListToPlayEntities,
  selectListToPlayPlaylistItems,
  selectListToPlayResult,
  selectListToPlaySnippetIds,
} from "./listToPlaySelectors";
import * as playlistActions from "./playlistActions";
import {
  selectAllPlaylists,
  selectPlaylistById,
  selectPlaylistIdByItemId,
  selectPlaylistsResult,
} from "./playlistSelectors";
import {
  ListToPlayEntities,
  ListToPlayPlaylistItemsEntity,
  ListToPlayResultItem,
  PlaylistsEntity,
} from "./types";

// ===============================================
// Helpers
// ===============================================
/**
 * Compare and check each item in items array, add to listToPlay if
 * the item is unique with regards to snippetId (not itemId).
 *
 * @param items New listToPlay items to be added
 *
 */
function* uniquelyAddListToPlayItems(
  items: {
    resultItem: ListToPlayResultItem;
    foreignKey: string;
  }[]
) {
  const prevEntities: ListToPlayEntities = yield select(
    selectListToPlayEntities
  );
  const prevResult: ListToPlayResultItem[] = yield select(
    selectListToPlayResult
  );
  const snippetIds: string[] = yield select(selectListToPlaySnippetIds);

  // clone entities and result to preserve immutability of redux states
  const newEntities = cloneDeep(prevEntities);
  const newResult = [...prevResult];

  for (const item of items) {
    const {
      resultItem: { id: itemId, schema },
      foreignKey,
    } = item;
    const currentSnippetId = yield select((state: AppState) =>
      selectSnippetIdByItemId(state, itemId)
    );

    // check if snippetId of current item existed previously
    // if no, add it to newEntities and newResult
    if (!snippetIds.includes(currentSnippetId)) {
      newEntities[schema][itemId] = { id: itemId, foreignKey };
      newResult.push({
        id: itemId,
        schema,
      });
    }
  }

  // merge new entities and result to listToPlay
  yield put(listToPlayActions.addUniqueListToPlay(newEntities, newResult));
}

/**
 * A helper function to label
 * allInPlaying/partialInPlaying label
 * of certain playlist based on the following simple rules:
 *
 * - All items in listToPlay: allInPlaying [/] partialInPlaying [X]
 * - No item in listToPlay: allInPlaying [X] partialInPlaying [X]
 * - Some items in listToPlay: allInPlaying [X] partialInPlaying[/]
 *
 * @param playlistId Playlist id to check
 *
 */
export function* labelAllOrPartialInPlaying(playlistId: string) {
  const playlist: ReturnType<typeof selectPlaylistById> = yield select(
    (state: AppState) => selectPlaylistById(state, playlistId)
  );
  const listToPlayPlaylistItems: ListToPlayPlaylistItemsEntity = yield select(
    selectListToPlayPlaylistItems
  );

  const {
    allInPlaying: prevAllInPlaying,
    partialInPlaying: prevPartialInPlaying,
    items: itemIds,
  } = playlist;
  const numOfPlaylistItems = itemIds.length;
  let numOfPlaylistItemsInListToPlay = 0;

  for (const itemId of itemIds) {
    if (listToPlayPlaylistItems[itemId]) {
      numOfPlaylistItemsInListToPlay += 1;
    }
  }

  // conditions for checking existence of playlist items in listToPlay
  // const allItemsExist =
  //   numOfPlaylistItemsInListToPlay === numOfPlaylistItems && !prevAllInPlaying;
  const allItemsExist = numOfPlaylistItemsInListToPlay === numOfPlaylistItems;
  const noItemExists = numOfPlaylistItemsInListToPlay === 0;
  const someItemsExist =
    numOfPlaylistItemsInListToPlay < numOfPlaylistItems && !noItemExists;

  // if all items exist in listToPlay
  // add allInPlaying label
  // and optionally remove partialInPlaying label (if exists)
  if (allItemsExist) {
    if (prevPartialInPlaying) {
      yield put(
        playlistActions.removePartialInPlayingLabelByIdAction(playlistId)
      );
    }

    if (!prevAllInPlaying) {
      yield put(playlistActions.addAllInPlayingLabelByIdAction(playlistId));
    }
  }

  // if no items exist in listToPlay
  // remove either allInPlaying/partialInPlaying label
  if (noItemExists) {
    if (prevAllInPlaying) {
      yield put(playlistActions.removeAllInPlayingLabelByIdAction(playlistId));
    }

    if (prevPartialInPlaying) {
      yield put(
        playlistActions.removePartialInPlayingLabelByIdAction(playlistId)
      );
    }
  }

  // if some of the items exist in listToPlay
  // add partialInPlaying label
  // and optionally remove allInPlaying label (if exists)
  if (someItemsExist) {
    if (prevAllInPlaying) {
      yield put(playlistActions.removeAllInPlayingLabelByIdAction(playlistId));
    }

    if (!prevPartialInPlaying) {
      yield put(playlistActions.addPartialInPlayingLabelByIdAction(playlistId));
    }
  }
}
// ===============================================
// End helpers
// ===============================================

// ===============================================
// Watchers
// ===============================================
export function* addListToPlayWatcher() {
  yield takeEvery(ActionTypes.ADD_LIST_TO_PLAY, function*(
    action: ActionType<typeof listToPlayActions.addListToPlayAction>
  ) {
    const {
      payload: { entities, result },
    } = action;

    const items = result.map(({ id, schema }) => ({
      resultItem: { id, schema },
      foreignKey: entities[schema][id].foreignKey,
    }));

    yield call(uniquelyAddListToPlayItems, items);
  });
}

export function* addListToPlayItemWatcher() {
  yield takeEvery(ActionTypes.ADD_LIST_TO_PLAY_ITEM, function*(
    action: ActionType<typeof listToPlayActions.addListToPlayItemAction>
  ) {
    const item = action.payload;
    yield call(uniquelyAddListToPlayItems, [item]);
  });
}

export function* addListToPlayItemsWatcher() {
  yield takeEvery(ActionTypes.ADD_LIST_TO_PLAY_ITEMS, function*(
    action: ActionType<typeof listToPlayActions.addListToPlayItemsAction>
  ) {
    const { items } = action.payload;
    yield call(uniquelyAddListToPlayItems, items);
  });
}

/**
 * Saga which watching for CLEAR_LIST_TO_PLAY for listToPlay.
 * If triggered, it dispatches action to remove allInPlaying for playlists which
 * include all its items in listToPlay
 *
 */
export function* clearListToPlayWatcher() {
  yield takeLatest(ActionTypes.CLEAR_LIST_TO_PLAY, function*() {
    const playlistIds: string[] = yield select(selectPlaylistsResult);

    // remove allInPlaying label if found
    for (const playlistId of playlistIds) {
      yield put(playlistActions.removeAllInPlayingLabelByIdAction(playlistId));
    }
  });
}

/**
 * Saga which watching for FILTER_LIST_TO_PLAY_ITEMS action.
 * If triggered, it dispatches action to clear the old listToPlay states,
 * then add new items that are filtered (obtained) from the previous states.
 *
 */
export function* filterListToPlayItemsWatcher() {
  yield takeEvery(ActionTypes.FILTER_LIST_TO_PLAY_ITEMS, function*(
    action: ActionType<typeof listToPlayActions.filterListToPlayItemsAction>
  ) {
    const { itemIds } = action.payload;
    const listToPlayResult: ListToPlayResultItem[] = yield select(
      selectListToPlayResult
    );
    const listToPlayEntities: ListToPlayEntities = yield select(
      selectListToPlayEntities
    );
    const filteredItems: {
      resultItem: ListToPlayResultItem;
      foreignKey: string;
    }[] = [];

    for (const item of listToPlayResult) {
      const { id, schema } = item;

      if (itemIds.includes(id)) {
        const itemEntity =
          schema === "playlistItems"
            ? listToPlayEntities.playlistItems[id]
            : listToPlayEntities.videoItems[id];

        filteredItems.push({
          resultItem: item,
          foreignKey: itemEntity.foreignKey,
        });
      }
    }

    // clear currentListToPlay before adding filteredItems
    yield put(listToPlayActions.clearListToPlayAction());
    yield put(listToPlayActions.addListToPlayItemsAction(filteredItems));
  });
}
// ===============================================
// End Watchers
// ===============================================

/**
 * A special saga that watches for multiple actions
 * that involving add/delete listToPlay items.
 * If the item(s) deleted is/are from playlist,
 * then the allInPlaying/partialInPlaying label
 * will be added or removed based on situation
 *
 */
export function* checkIfAllOrPartialPlaylistItemsInPlaying() {
  while (true) {
    const action: ActionType<
      | typeof listToPlayActions.addUniqueListToPlay
      | typeof listToPlayActions.deleteListToPlayItemByIdAction
      | typeof listToPlayActions.deleteListToPlayItemsAction
      | typeof listToPlayActions.updateListToPlayAction
      | typeof playlistActions.syncPlaylistFromYTByIdSuccessAction
    > = yield take([
      ActionTypes.ADD_UNIQUE_LIST_TO_PLAY,
      ActionTypes.DELETE_LIST_TO_PLAY_ITEM_BY_ID,
      ActionTypes.DELETE_LIST_TO_PLAY_ITEMS,
      ActionTypes.UPDATE_LIST_TO_PLAY,
      ActionTypes.SYNC_PLAYLIST_FROM_YT_BY_ID_SUCCESS,
    ]);
    let playlistId: string | undefined;
    let playlistIds: string[] | undefined;

    switch (action.type) {
      case "ADD_UNIQUE_LIST_TO_PLAY": {
        const {
          entities: { playlistItems },
        } = action.payload;

        playlistIds = uniq(map(playlistItems, (item) => item.foreignKey));

        break;
      }

      case "DELETE_LIST_TO_PLAY_ITEM_BY_ID": {
        const { id: itemId } = action.payload;
        playlistId = yield select((state) =>
          selectPlaylistIdByItemId(state, itemId)
        );

        break;
      }

      // check if deleted itemIds are part of playlist's items
      // if so then add it to playlistIds array waiting to be removed
      case "DELETE_LIST_TO_PLAY_ITEMS": {
        const { ids: itemIds } = action.payload;
        const playlists: PlaylistsEntity = yield select(selectAllPlaylists);
        playlistIds = [];

        for (const [playlistId, playlist] of Object.entries(playlists)) {
          const playlistContainsDeletedItem = playlist.items.some(
            (playlistItemId) => itemIds.includes(playlistItemId)
          );

          if (playlistContainsDeletedItem) {
            playlistIds.push(playlistId);
          }
        }

        break;
      }

      case "UPDATE_LIST_TO_PLAY": {
        const { schema } = action.payload;

        // do nothing if the items updated are not from playlist
        if (schema === "videoItems") break;

        // check the availability of items in ALL playlists
        // because UPDATE_LIST_TO_PLAY will delete
        // most of the items regardless which playlist
        // those items belong
        playlistIds = yield select(selectPlaylistsResult);

        break;
      }

      case "SYNC_PLAYLIST_FROM_YT_BY_ID_SUCCESS": {
        playlistId = action.payload.playlistId;
        break;
      }

      default: {
        break;
      }
    }

    if (playlistId) {
      yield fork(labelAllOrPartialInPlaying, playlistId);
    }

    if (playlistIds && playlistIds.length !== 0) {
      for (const playlistId of playlistIds) {
        yield fork(labelAllOrPartialInPlaying, playlistId);
      }
    }
  }
}

export default function* listToPlaySagas() {
  yield all([
    addListToPlayWatcher(),
    addListToPlayItemWatcher(),
    addListToPlayItemsWatcher(),
    clearListToPlayWatcher(),
    filterListToPlayItemsWatcher(),
    checkIfAllOrPartialPlaylistItemsInPlaying(),
  ]);
}
