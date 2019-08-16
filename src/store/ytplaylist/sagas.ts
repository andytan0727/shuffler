import { all, put, select, takeEvery } from "redux-saga/effects";
import { ActionType } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";
import { notify } from "utils/helper/notifyHelper";

import * as ytplaylistAction from "./action";
import { selectPlayingVideos, selectVideos } from "./selector";
import { Video } from "./types";

type DeleteVideosAction = ActionType<
  typeof ytplaylistAction.deleteVideosAction
>;
type AddVideosToListToPlayAction = ActionType<
  typeof ytplaylistAction.addVideosToListToPlayAction
>;
type RemoveVideosFromListToPlayAction = ActionType<
  typeof ytplaylistAction.removeVideosFromListToPlayAction
>;

// =============================================
// Videos
// =============================================
/**
 * Saga which listening to DELETE_VIDEOS action, then dispatch
 * REMOVE_VIDEOS_FROM_LIST_TO_PLAY action to clear the residue
 *
 * @deprecated Remove as of next stable version (v4.0)
 *
 * @export
 * @param action
 */
export function* deleteVideos(action: DeleteVideosAction) {
  const videoIdsToRemove = action.payload.videoIds;

  if (Array.isArray && !Array.isArray(videoIdsToRemove))
    throw new Error("deleteVideos: Args supplied is not an array");

  // clear video residuals in playingVideos, listToPlay and checkedVideos
  yield put(ytplaylistAction.removePlayingVideosAction(videoIdsToRemove));
  yield put(
    ytplaylistAction.removeFromListToPlayAction(videoIdsToRemove, "videos")
  );
  yield put(ytplaylistAction.setCheckedVideosAction([]));
}

/**
 * Saga that listens to ADD_VIDEOS_TO_LIST_TO_PLAY action,
 * which then dispatch ADD_PLAYING_VIDEOS action,
 * APPEND_LIST_TO_PLAY action,
 * and SET_CHECKED_VIDEOS action
 *
 * @deprecated Remove as of next stable version (v4.0)
 *
 * @export
 * @param action
 */
export function* addVideosToListToPlay(action: AddVideosToListToPlayAction) {
  const videoIds = action.payload.videoIds;

  if (videoIds.length === 0)
    throw new Error("Video Ids array is empty. Nothing to remove");

  const videos: Video[] = yield select((state) => state.ytplaylist.videos);
  const videoItemsToAdd = videos
    .filter((video) => videoIds.includes(video.id))
    .map((filteredVideo) => filteredVideo.items)
    .reduce((acc, val) => acc.concat(val), []);

  // update playingVideos, listToPlay and checkedVideos respectively
  yield put(ytplaylistAction.addPlayingVideosAction(videoIds));
  yield put(ytplaylistAction.appendListToPlayAction(videoItemsToAdd));
  yield put(ytplaylistAction.setCheckedVideosAction([]));
}

/**
 * Saga which listening to REMOVE_VIDEOS_FROM_LIST_TO_PLAY action,
 * then it dispatches REMOVE_PLAYING_VIDEOS action,
 * REMOVE_FROM_LIST_TO_PLAY action and SET_CHECKED_VIDEOS action
 * subsequently
 *
 * @deprecated Remove as of next stable version (v4.0)
 *
 * @export
 * @param action
 */
export function* removeVideosFromListToPlay(
  action: RemoveVideosFromListToPlayAction
) {
  const videoIdsToRemove = action.payload.videoIds;
  const videos: Video[] = yield select(selectVideos);
  const playingVideos: string[] = yield select(selectPlayingVideos);

  if (videoIdsToRemove.length === 0) return;

  for (const videoIdToRemove of videoIdsToRemove) {
    const videoToRemove = videos.filter(
      (video) => video.id === videoIdToRemove
    )[0];

    if (!videoIdToRemove) return;

    const videoIdentifier =
      (videoToRemove.items[0] && videoToRemove.items[0].snippet.title) ||
      videoIdToRemove;

    if (!playingVideos.includes(videoIdToRemove)) {
      notify("warning", `video: ${videoIdentifier} is not included in playing`);

      continue;
    }

    yield put(ytplaylistAction.removePlayingVideosAction([videoIdToRemove]));

    // only notify user if the user is removing video from listToPlay
    // instead of deleting it
    notify("success", `Successfully removed video(s) from playing 😎`);
  }

  yield put(
    ytplaylistAction.removeFromListToPlayAction(videoIdsToRemove, "videos")
  );
  yield put(ytplaylistAction.setCheckedVideosAction([])); // clear checkedVideos
}

// =============================================
// Saga Watchers
// =============================================
/**
 * @deprecated Remove as of next stable version (v4.0)
 */
function* deleteVideosWatcher() {
  yield takeEvery(ActionTypes.DELETE_VIDEOS, deleteVideos);
}

/**
 * @deprecated Remove as of next stable version (v4.0)
 */
function* addVideosToListToPlayWatcher() {
  yield takeEvery(
    ActionTypes.ADD_VIDEOS_TO_LIST_TO_PLAY,
    addVideosToListToPlay
  );
}

/**
 * @deprecated Remove as of next stable version (v4.0)
 */
function* removeVideosFromListToPlayWatcher() {
  yield takeEvery(
    ActionTypes.REMOVE_VIDEOS_FROM_LIST_TO_PLAY,
    removeVideosFromListToPlay
  );
}

export default function* ytplaylistSaga() {
  yield all([
    deleteVideosWatcher(),
    addVideosToListToPlayWatcher(),
    removeVideosFromListToPlayWatcher(),
  ]);
}
