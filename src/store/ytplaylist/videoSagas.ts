import { all, put, takeEvery } from "redux-saga/effects";
import { ActionType } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import * as listToPlayActions from "./listToPlayActions";
import * as videoActions from "./videoActions";

/**
 * Saga which watching for DELETE_NORM_VIDEO_BY_ID action.
 * If triggered, it dispatch an action to delete the respective video item from
 * normListToPlay (if exists) as well
 *
 */
export function* deleteNormVideoByIdWatcher() {
  yield takeEvery(ActionTypes.DELETE_NORM_VIDEO_BY_ID, function*(
    action: ActionType<typeof videoActions.deleteNormVideoByIdAction>
  ) {
    const {
      payload: { id },
    } = action;

    // remove item from normalized listToPlay videoItems
    yield put(listToPlayActions.deleteNormListToPlayItemByIdAction(id));
  });
}

/**
 * Saga that watching for ADD_NORM_VIDEO_TO_NORM_LIST_TO_PLAY action.
 * If triggered, it dispatches an action to add video item
 * to normalized listToPlay
 *
 */
export function* addNormVideoToNormListToPlayWatcher() {
  yield takeEvery(ActionTypes.ADD_NORM_VIDEO_TO_NORM_LIST_TO_PLAY, function*(
    action: ActionType<typeof videoActions.addNormVideoToNormListToPlayAction>
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
      listToPlayActions.addNormListToPlayItemAction(
        listToPlayVideoItem.resultItem,
        listToPlayVideoItem.foreignKey
      )
    );
  });
}

/**
 * Saga that watching for ADD_NORM_VIDEOS_TO_NORM_LIST_TO_PLAY action.
 * If triggered, it dispatches multiple ADD_NORM_VIDEO_TO_NORM_LIST_TO_PLAY actions
 * to add all item with the videoId as specified in videoIds array
 *
 */
export function* addNormVideosToNormListToPlayWatcher() {
  yield takeEvery(ActionTypes.ADD_NORM_VIDEOS_TO_NORM_LIST_TO_PLAY, function*(
    action: ActionType<typeof videoActions.addNormVideosToNormListToPlayAction>
  ) {
    const {
      payload: { videoIds },
    } = action;

    for (const videoId of videoIds) {
      yield put(videoActions.addNormVideoToNormListToPlayAction(videoId));
    }
  });
}

/**
 * Saga that watching for REMOVE_NORM_VIDEO_FROM_NORM_LIST_TO_PLAY action.
 * If triggered, it dispatches an action to remove playlist item from normalized listToPlay
 *
 */
export function* removeNormVideoFromNormListToPlayWatcher() {
  yield takeEvery(
    ActionTypes.REMOVE_NORM_VIDEO_FROM_NORM_LIST_TO_PLAY,
    function*(
      action: ActionType<
        typeof videoActions.removeNormVideoFromNormListToPlayAction
      >
    ) {
      const {
        payload: { videoId: itemId },
      } = action;

      yield put(listToPlayActions.deleteNormListToPlayItemByIdAction(itemId));
    }
  );
}

/**
 * Saga that watching for REMOVE_NORM_VIDEOS_FROM_NORM_LIST_TO_PLAY action.
 * If triggered, it dispatches DELETE_NORM_LIST_TO_PLAY_ITEMS action
 * to remove video items from normalized listToPlay
 *
 */
export function* removeNormVideosFromNormListToPlayWatcher() {
  yield takeEvery(
    ActionTypes.REMOVE_NORM_VIDEOS_FROM_NORM_LIST_TO_PLAY,
    function*(
      action: ActionType<
        typeof videoActions.removeNormVideosFromNormListToPlayAction
      >
    ) {
      const {
        payload: { videoIds: itemIds },
      } = action;

      yield put(listToPlayActions.deleteNormListToPlayItemsAction(itemIds));
    }
  );
}

export default function* videoSagas() {
  yield all([
    deleteNormVideoByIdWatcher(),
    addNormVideoToNormListToPlayWatcher(),
    addNormVideosToNormListToPlayWatcher(),
    removeNormVideoFromNormListToPlayWatcher(),
    removeNormVideosFromNormListToPlayWatcher(),
  ]);
}
