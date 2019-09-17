import { map, uniq } from "lodash";
import { all, call, fork, put, select, take } from "redux-saga/effects";
import { AppState } from "store";
import { ActionType } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import { selectListToPlayPlaylistItemsCount } from "./generalSelectors";
import * as listToPlayActions from "./listToPlayActions";
import * as playlistActions from "./playlistActions";
import * as playlistSelectors from "./playlistSelectors";
import { PlaylistsEntityItem } from "./types";

type CheckLabelActionsWatched = ActionType<
  | typeof listToPlayActions.addUniqueListToPlay
  | typeof listToPlayActions.deleteListToPlayItemByIdAction
  | typeof listToPlayActions.deleteListToPlayItemsAction
  | typeof listToPlayActions.updateListToPlayAction
  | typeof playlistActions.syncPlaylistFromYTByIdSuccessAction
>;

// ===============================================
// Helpers
// ===============================================
function* removeExistingPartialInPlayingLabel(
  prevLabel: boolean | undefined,
  playlistId: string
) {
  if (prevLabel)
    yield put(
      playlistActions.removePartialInPlayingLabelByIdAction(playlistId)
    );
}

function* removeExistingAllInPlayingLabel(
  prevLabel: boolean | undefined,
  playlistId: string
) {
  if (prevLabel)
    yield put(playlistActions.removeAllInPlayingLabelByIdAction(playlistId));
}

function* removeAllLabels(
  prevAllInPlaying: boolean | undefined,
  prevPartialInPlaying: boolean | undefined,
  playlistId: string
) {
  yield call(removeExistingAllInPlayingLabel, prevAllInPlaying, playlistId);

  yield call(
    removeExistingPartialInPlayingLabel,
    prevPartialInPlaying,
    playlistId
  );
}

function* addAllInPlayingLabel(
  prevAllInPlaying: boolean | undefined,
  prevPartialInPlaying: boolean | undefined,
  playlistId: string
) {
  yield call(
    removeExistingPartialInPlayingLabel,
    prevPartialInPlaying,
    playlistId
  );

  if (!prevAllInPlaying)
    yield put(playlistActions.addAllInPlayingLabelByIdAction(playlistId));
}

function* addPartialInPlayingLabel(
  prevAllInPlaying: boolean | undefined,
  prevPartialInPlaying: boolean | undefined,
  playlistId: string
) {
  yield call(removeExistingAllInPlayingLabel, prevAllInPlaying, playlistId);

  if (!prevPartialInPlaying)
    yield put(playlistActions.addPartialInPlayingLabelByIdAction(playlistId));
}

/**
 * A helper function to label allInPlaying/partialInPlaying label
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
  if (!playlistId) return;

  const playlist: PlaylistsEntityItem = yield select((state: AppState) =>
    playlistSelectors.selectPlaylistById(state, playlistId)
  );
  const listToPlayPlaylistItemsCount: number = yield select((state: AppState) =>
    selectListToPlayPlaylistItemsCount(state, playlistId)
  );

  const {
    allInPlaying: prevAllInPlaying,
    partialInPlaying: prevPartialInPlaying,
    items: itemIds,
  } = playlist;
  const playlistItemsCount = itemIds.length;

  // conditions for checking existence of playlist items in listToPlay
  const allItemsExist = listToPlayPlaylistItemsCount === playlistItemsCount;
  const noItemExists = listToPlayPlaylistItemsCount === 0;
  const someItemsExist =
    listToPlayPlaylistItemsCount < playlistItemsCount && !noItemExists;

  // if all items exist in listToPlay
  // add allInPlaying label
  // and optionally remove partialInPlaying label (if exists)
  if (allItemsExist)
    yield call(
      addAllInPlayingLabel,
      prevAllInPlaying,
      prevPartialInPlaying,
      playlistId
    );

  // if no items exist in listToPlay
  // remove either allInPlaying/partialInPlaying label
  if (noItemExists)
    yield call(
      removeAllLabels,
      prevAllInPlaying,
      prevPartialInPlaying,
      playlistId
    );

  // if some of the items exist in listToPlay
  // add partialInPlaying label
  // and optionally remove allInPlaying label (if exists)
  if (someItemsExist)
    yield call(
      addPartialInPlayingLabel,
      prevAllInPlaying,
      prevPartialInPlaying,
      playlistId
    );
}

/**
 * Helper function to get playlistId(s) from action payload
 *
 * @param action Action watched in checkLabelSagas
 */
function* getPlaylistIds(action: CheckLabelActionsWatched) {
  switch (action.type) {
    case "ADD_UNIQUE_LIST_TO_PLAY": {
      return uniq(
        map(action.payload.entities.playlistItems, (item) => item.foreignKey)
      );
    }

    // NOTE: playlistId selected will be undefined if
    //       the itemId is belonged to videos.
    //       Logic to handle undefined playlistId is
    //       set at labelAllOrPartialInPlaying func
    case "DELETE_LIST_TO_PLAY_ITEM_BY_ID": {
      return [
        yield select((state: AppState) =>
          playlistSelectors.selectPlaylistIdByItemId(state, action.payload.id)
        ),
      ];
    }

    // check if deleted itemIds are part of playlist's items
    // if so then add it to playlistIds array waiting to be removed
    case "DELETE_LIST_TO_PLAY_ITEMS": {
      const temp: string[] = [];

      for (const itemId of action.payload.ids) {
        temp.push(
          yield select((state) =>
            playlistSelectors.selectPlaylistIdByItemId(state, itemId)
          )
        );
      }

      return uniq(temp);
    }

    // check the availability of items in ALL playlists
    // because UPDATE_LIST_TO_PLAY will delete
    // most of the items regardless which playlist
    // those items belong
    case "UPDATE_LIST_TO_PLAY": {
      return yield select(playlistSelectors.selectPlaylistsResult);
    }

    case "SYNC_PLAYLIST_FROM_YT_BY_ID_SUCCESS": {
      return [action.payload.playlistId];
    }

    default: {
      return [];
    }
  }
}

// ===============================================
// End helpers
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
    const action: CheckLabelActionsWatched = yield take([
      ActionTypes.ADD_UNIQUE_LIST_TO_PLAY,
      ActionTypes.DELETE_LIST_TO_PLAY_ITEM_BY_ID,
      ActionTypes.DELETE_LIST_TO_PLAY_ITEMS,
      ActionTypes.UPDATE_LIST_TO_PLAY,
      ActionTypes.SYNC_PLAYLIST_FROM_YT_BY_ID_SUCCESS,
    ]);
    const playlistIds: string[] = yield call(getPlaylistIds, action);

    for (const playlistId of playlistIds) {
      yield fork(labelAllOrPartialInPlaying, playlistId);
    }
  }
}

export default function* checkLabelSagas() {
  yield all([checkIfAllOrPartialPlaylistItemsInPlaying()]);
}
