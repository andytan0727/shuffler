import cloneDeep from "lodash/cloneDeep";
import { all, call, put, select, takeEvery } from "redux-saga/effects";
import { ActionType } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import {
  addAllInPlayingLabelByIdAction,
  addNormListToPlayAction,
  addNormListToPlayItemAction,
  addNormListToPlayItemsAction,
  addNormPlaylistToNormListToPlayAction,
  addUniqueNormListToPlay,
  deleteNormListToPlayItemByIdAction,
  deleteNormListToPlayItemsAction,
  deleteNormPlaylistItemByIdAction,
  deleteNormVideoByIdAction,
  removeAllInPlayingLabelByIdAction,
  removeNormPlaylistFromNormListToPlayAction,
} from "./normAction";
import {
  selectNormListToPlayEntities,
  selectNormListToPlayResult,
  selectNormListToPlaySnippetIds,
  selectNormSnippetIdByItemId,
} from "./normSelector";
import { NormListToPlayEntities, NormListToPlayResultItem } from "./types";

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
      resultItem: { id: itemId, source, schema },
      foreignKey,
    } = item;
    const currentSnippetId = yield select((state) =>
      selectNormSnippetIdByItemId(state as never, itemId)
    );

    // check if snippetId of current item existed previously
    // if no, add it to newEntities and newResult
    if (!snippetIds.includes(currentSnippetId)) {
      newEntities[schema][itemId] = { id: itemId, foreignKey };
      newResult.push({ id: itemId, source, schema });
    }
  }

  // merge new entities and result to normalized listToPlay
  yield put(addUniqueNormListToPlay(newEntities, newResult));
}
// ===============================================
// End helpers
// ===============================================

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

    const playlistItems = itemIds.map((itemId) => ({
      resultItem: {
        id: itemId,
        source: "playlists" as MediaSourceType,
        schema: "playlistItems" as SchemaType,
      },
      foreignKey: playlistId,
    }));

    // add all items in the playlist into normListToPlay
    yield put(addNormListToPlayItemsAction(playlistItems));
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

export function* addNormListToPlayWatcher() {
  yield takeEvery(ActionTypes.ADD_NORM_LIST_TO_PLAY, function*(
    action: ActionType<typeof addNormListToPlayAction>
  ) {
    const {
      payload: { entities, result },
    } = action;

    const items = result.map(({ id, source, schema }) => ({
      resultItem: { id, source, schema },
      foreignKey: entities[schema][id].foreignKey,
    }));

    yield call(uniquelyAddListToPlayItems, items);
  });
}

export function* addNormListToPlayItemWatcher() {
  yield takeEvery(ActionTypes.ADD_NORM_LIST_TO_PLAY_ITEM, function*(
    action: ActionType<typeof addNormListToPlayItemAction>
  ) {
    const item = action.payload;
    yield call(uniquelyAddListToPlayItems, [item]);
  });
}

export function* addNormListToPlayItemsWatcher() {
  yield takeEvery(ActionTypes.ADD_NORM_LIST_TO_PLAY_ITEMS, function*(
    action: ActionType<typeof addNormListToPlayItemsAction>
  ) {
    const { items } = action.payload;
    yield call(uniquelyAddListToPlayItems, items);
  });
}

export default function* ytplaylistNormedSaga() {
  yield all([
    deleteNormVideoByIdWatcher(),
    deleteNormPlaylistItemByIdWatcher(),
    addNormPlaylistToNormListToPlayWatcher(),
    removeNormPlaylistFromNormListToPlayWatcher(),
    addNormListToPlayWatcher(),
    addNormListToPlayItemWatcher(),
    addNormListToPlayItemsWatcher(),
  ]);
}
