import cloneDeep from "lodash/cloneDeep";
import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import { AppState } from "store";
import { ActionType } from "typesafe-actions";
import {
  ADD_LIST_TO_PLAY,
  ADD_LIST_TO_PLAY_ITEM,
  ADD_LIST_TO_PLAY_ITEMS,
  CLEAR_LIST_TO_PLAY,
  FILTER_LIST_TO_PLAY_ITEMS,
} from "utils/constants/actionConstants";

import { selectSnippetIdByItemId } from "./generalSelectors";
import {
  addListToPlayAction,
  addListToPlayItemAction,
  addListToPlayItemsAction,
  addUniqueListToPlay,
  clearListToPlayAction,
  filterListToPlayItemsAction,
} from "./listToPlayActions";
import {
  selectListToPlayEntities,
  selectListToPlayResult,
  selectListToPlaySnippetIds,
} from "./listToPlaySelectors";
import { removeAllInPlayingLabelByIdAction } from "./playlistActions";
import { selectPlaylistsResult } from "./playlistSelectors";
import { ListToPlayEntities, ListToPlayResultItem } from "./types";

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
  yield put(addUniqueListToPlay(newEntities, newResult));
}

// ===============================================
// End helpers
// ===============================================

// ===============================================
// Watchers
// ===============================================
export function* addListToPlayWatcher() {
  yield takeEvery(ADD_LIST_TO_PLAY, function*(
    action: ActionType<typeof addListToPlayAction>
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
  yield takeEvery(ADD_LIST_TO_PLAY_ITEM, function*(
    action: ActionType<typeof addListToPlayItemAction>
  ) {
    const item = action.payload;
    yield call(uniquelyAddListToPlayItems, [item]);
  });
}

export function* addListToPlayItemsWatcher() {
  yield takeEvery(ADD_LIST_TO_PLAY_ITEMS, function*(
    action: ActionType<typeof addListToPlayItemsAction>
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
  yield takeLatest(CLEAR_LIST_TO_PLAY, function*() {
    const playlistIds: string[] = yield select(selectPlaylistsResult);

    // remove allInPlaying label if found
    for (const playlistId of playlistIds) {
      yield put(removeAllInPlayingLabelByIdAction(playlistId));
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
  yield takeEvery(FILTER_LIST_TO_PLAY_ITEMS, function*(
    action: ActionType<typeof filterListToPlayItemsAction>
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
    yield put(clearListToPlayAction());
    yield put(addListToPlayItemsAction(filteredItems));
  });
}
// ===============================================
// End Watchers
// ===============================================

export default function* listToPlaySagas() {
  yield all([
    addListToPlayWatcher(),
    addListToPlayItemWatcher(),
    addListToPlayItemsWatcher(),
    clearListToPlayWatcher(),
    filterListToPlayItemsWatcher(),
  ]);
}
