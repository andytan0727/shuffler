import { all, put, takeEvery } from "redux-saga/effects";
import { ActionType } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import * as listToPlayActions from "./listToPlayActions";
import * as videoActions from "./videoActions";

/**
 * Saga which watching for DELETE_VIDEO_BY_ID action.
 * If triggered, it dispatch an action to delete the respective video item from
 * listToPlay (if exists) as well
 *
 */
export function* deleteVideoByIdWatcher() {
  yield takeEvery(ActionTypes.DELETE_VIDEO_BY_ID, function*(
    action: ActionType<typeof videoActions.deleteVideoByIdAction>
  ) {
    const {
      payload: { id },
    } = action;

    // remove item from listToPlay videoItems
    yield put(listToPlayActions.deleteListToPlayItemByIdAction(id));
  });
}

/**
 * Saga that watching for ADD_VIDEO_TO_LIST_TO_PLAY action.
 * If triggered, it dispatches an action to add video item
 * to listToPlay
 *
 */
export function* addVideoToListToPlayWatcher() {
  yield takeEvery(ActionTypes.ADD_VIDEO_TO_LIST_TO_PLAY, function*(
    action: ActionType<typeof videoActions.addVideoToListToPlayAction>
  ) {
    const {
      payload: { videoId },
    } = action;

    const listToPlayVideoItem = {
      resultItem: {
        id: videoId,
        schema: "videoItems" as SchemaType,
      },
      foreignKey: videoId,
    };

    yield put(
      listToPlayActions.addListToPlayItemAction(
        listToPlayVideoItem.resultItem,
        listToPlayVideoItem.foreignKey
      )
    );
  });
}

/**
 * Saga that watching for ADD_VIDEOS_TO_LIST_TO_PLAY action.
 * If triggered, it dispatches multiple ADD_VIDEO_TO_LIST_TO_PLAY actions
 * to add all item with the videoId as specified in videoIds array
 *
 */
export function* addVideosToListToPlayWatcher() {
  yield takeEvery(ActionTypes.ADD_VIDEOS_TO_LIST_TO_PLAY, function*(
    action: ActionType<typeof videoActions.addVideosToListToPlayAction>
  ) {
    const {
      payload: { videoIds },
    } = action;

    for (const videoId of videoIds) {
      yield put(videoActions.addVideoToListToPlayAction(videoId));
    }
  });
}

/**
 * Saga that watching for REMOVE_VIDEO_FROM_LIST_TO_PLAY action.
 * If triggered, it dispatches an action to remove playlist item from listToPlay
 *
 */
export function* removeVideoFromListToPlayWatcher() {
  yield takeEvery(ActionTypes.REMOVE_VIDEO_FROM_LIST_TO_PLAY, function*(
    action: ActionType<typeof videoActions.removeVideoFromListToPlayAction>
  ) {
    const {
      payload: { videoId: itemId },
    } = action;

    yield put(listToPlayActions.deleteListToPlayItemByIdAction(itemId));
  });
}

/**
 * Saga that watching for REMOVE_VIDEOS_FROM_LIST_TO_PLAY action.
 * If triggered, it dispatches DELETE_LIST_TO_PLAY_ITEMS action
 * to remove video items from listToPlay
 *
 */
export function* removeVideosFromListToPlayWatcher() {
  yield takeEvery(ActionTypes.REMOVE_VIDEOS_FROM_LIST_TO_PLAY, function*(
    action: ActionType<typeof videoActions.removeVideosFromListToPlayAction>
  ) {
    const {
      payload: { videoIds: itemIds },
    } = action;

    yield put(listToPlayActions.deleteListToPlayItemsAction(itemIds));
  });
}

export default function* videoSagas() {
  yield all([
    deleteVideoByIdWatcher(),
    addVideoToListToPlayWatcher(),
    addVideosToListToPlayWatcher(),
    removeVideoFromListToPlayWatcher(),
    removeVideosFromListToPlayWatcher(),
  ]);
}
