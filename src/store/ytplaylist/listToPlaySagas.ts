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

import { selectNormSnippetIdByItemId } from "./generalSelectors";
import * as listToPlayActions from "./listToPlayActions";
import {
  selectNormListToPlayEntities,
  selectNormListToPlayPlaylistItems,
  selectNormListToPlayResult,
  selectNormListToPlaySnippetIds,
} from "./listToPlaySelectors";
import * as playlistActions from "./playlistActions";
import {
  selectAllNormPlaylists,
  selectNormPlaylistById,
  selectNormPlaylistIdByItemId,
  selectNormPlaylistsResult,
} from "./playlistSelectors";
import {
  NormListToPlayEntities,
  NormListToPlayPlaylistItemsEntity,
  NormListToPlayResultItem,
  NormPlaylistsSourceEntity,
} from "./types";

// ===============================================
// Helpers
// ===============================================
/**
 * Compare and check each item in items array, add to normalized listToPlay if
 * the item is unique with regards to snippetId (not itemId).
 *
 * @param items New listToPlay items to be added
 *
 */
function* uniquelyAddListToPlayItems(
  items: {
    resultItem: NormListToPlayResultItem;
    foreignKey: string;
  }[]
) {
  const prevEntities: NormListToPlayEntities = yield select(
    selectNormListToPlayEntities
  );
  const prevResult: NormListToPlayResultItem[] = yield select(
    selectNormListToPlayResult
  );
  const snippetIds: string[] = yield select(selectNormListToPlaySnippetIds);

  // clone entities and result to preserve immutability of redux states
  const newEntities = cloneDeep(prevEntities);
  const newResult = [...prevResult];

  for (const item of items) {
    const {
      resultItem: { id: itemId, schema },
      foreignKey,
    } = item;
    const currentSnippetId = yield select((state: AppState) =>
      selectNormSnippetIdByItemId(state, itemId)
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

  // merge new entities and result to normalized listToPlay
  yield put(listToPlayActions.addUniqueNormListToPlay(newEntities, newResult));
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
  const playlist: ReturnType<typeof selectNormPlaylistById> = yield select(
    (state: AppState) => selectNormPlaylistById(state, playlistId)
  );
  const listToPlayPlaylistItems: NormListToPlayPlaylistItemsEntity = yield select(
    selectNormListToPlayPlaylistItems
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
export function* addNormListToPlayWatcher() {
  yield takeEvery(ActionTypes.ADD_NORM_LIST_TO_PLAY, function*(
    action: ActionType<typeof listToPlayActions.addNormListToPlayAction>
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

export function* addNormListToPlayItemWatcher() {
  yield takeEvery(ActionTypes.ADD_NORM_LIST_TO_PLAY_ITEM, function*(
    action: ActionType<typeof listToPlayActions.addNormListToPlayItemAction>
  ) {
    const item = action.payload;
    yield call(uniquelyAddListToPlayItems, [item]);
  });
}

export function* addNormListToPlayItemsWatcher() {
  yield takeEvery(ActionTypes.ADD_NORM_LIST_TO_PLAY_ITEMS, function*(
    action: ActionType<typeof listToPlayActions.addNormListToPlayItemsAction>
  ) {
    const { items } = action.payload;
    yield call(uniquelyAddListToPlayItems, items);
  });
}

/**
 * Saga which watching for CLEAR_LIST_TO_PLAY for normalized listToPlay.
 * If triggered, it dispatches action to remove allInPlaying for playlists which
 * include all its items in normalized listToPlay
 *
 */
export function* clearListToPlayWatcher() {
  yield takeLatest(ActionTypes.CLEAR_LIST_TO_PLAY, function*() {
    const playlistIds: string[] = yield select(selectNormPlaylistsResult);

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
    const listToPlayResult: NormListToPlayResultItem[] = yield select(
      selectNormListToPlayResult
    );
    const listToPlayEntities: NormListToPlayEntities = yield select(
      selectNormListToPlayEntities
    );
    const filteredItems: {
      resultItem: NormListToPlayResultItem;
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
    yield put(listToPlayActions.addNormListToPlayItemsAction(filteredItems));
  });
}
// ===============================================
// End Watchers
// ===============================================

/**
 * A special saga that watches for multiple actions
 * that involving add/delete normalized listToPlay items.
 * If the item(s) deleted is/are from playlist,
 * then the allInPlaying/partialInPlaying label
 * will be added or removed based on situation
 *
 */
export function* checkIfAllOrPartialPlaylistItemsInPlaying() {
  while (true) {
    const action: ActionType<
      | typeof listToPlayActions.addUniqueNormListToPlay
      | typeof listToPlayActions.deleteNormListToPlayItemByIdAction
      | typeof listToPlayActions.deleteNormListToPlayItemsAction
    > = yield take([
      ActionTypes.ADD_UNIQUE_NORM_LIST_TO_PLAY,
      ActionTypes.DELETE_NORM_LIST_TO_PLAY_ITEM_BY_ID,
      ActionTypes.DELETE_NORM_LIST_TO_PLAY_ITEMS,
    ]);
    let playlistId: string | undefined;
    let playlistIds: string[] | undefined;

    switch (action.type) {
      case "ADD_UNIQUE_NORM_LIST_TO_PLAY": {
        const {
          entities: { playlistItems },
        } = action.payload;

        playlistIds = uniq(map(playlistItems, (item) => item.foreignKey));

        break;
      }

      case "DELETE_NORM_LIST_TO_PLAY_ITEM_BY_ID": {
        const { id: itemId } = action.payload;

        // playlistId is undefined if the itemId is belonged to video
        playlistId = yield select((state) =>
          selectNormPlaylistIdByItemId(state, itemId)
        );

        break;
      }

      // check if deleted itemIds are part of playlist's items
      // if so then add it to playlistIds array waiting to be removed
      case "DELETE_NORM_LIST_TO_PLAY_ITEMS": {
        const { ids: itemIds } = action.payload;
        const playlists: NormPlaylistsSourceEntity = yield select(
          selectAllNormPlaylists
        );
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

      default: {
        playlistId = undefined;
        playlistIds = undefined;
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
    addNormListToPlayWatcher(),
    addNormListToPlayItemWatcher(),
    addNormListToPlayItemsWatcher(),
    clearListToPlayWatcher(),
    filterListToPlayItemsWatcher(),
    checkIfAllOrPartialPlaylistItemsInPlaying(),
  ]);
}
