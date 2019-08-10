import shuffle from "lodash/shuffle";
import { all, put, select, take, takeEvery } from "redux-saga/effects";
import { ActionType } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";
import { notify } from "utils/helper/notifyHelper";

import * as ytplaylistAction from "./action";
import * as ytplaylistNormedAction from "./normAction";
import {
  selectNormPlaylistItemIdsByPlaylistId,
  selectNormVideoItemIdsByVideoId,
} from "./normSelector";
import { Playlist, PlaylistItem, Video, VideoItem } from "./types";

type DeletePlaylistsAction = ActionType<
  typeof ytplaylistAction.deletePlaylistsAction
>;
type AddPlaylistsToListToPlayAction = ActionType<
  typeof ytplaylistAction.addPlaylistsToListToPlayAction
>;
type RemovePlaylistsFromListToPlayAction = ActionType<
  typeof ytplaylistAction.removePlaylistsFromListToPlayAction
>;
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
// Playlist
// =============================================

/**
 * Saga which listening for lDELETE_PLAYLISTS action,
 * which in turn dispatch REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY
 * action to clear any possible leftover on playingPlaylists
 * and listToPlay
 *
 * NOTE: added logic to update normalized states as well
 *
 * @export
 * @param action
 */
export function* deletePlaylists(action: DeletePlaylistsAction) {
  const playlistIdsToRemove = action.payload.playlistIds;

  if (Array.isArray && !Array.isArray(playlistIdsToRemove))
    throw new Error("deletePlaylists: Args supplied is not an array");

  // remove playlist residuals from playingPlaylists, listToPlay and checkedPlaylists
  yield put(ytplaylistAction.removePlayingPlaylistsAction(playlistIdsToRemove));
  yield put(
    ytplaylistAction.removeFromListToPlayAction(
      playlistIdsToRemove,
      "playlists"
    )
  );
  yield put(ytplaylistAction.setCheckedPlaylistsAction([]));

  // =============================================
  // Porting to normalized states
  // =============================================
  for (const playlistIdToRemove of playlistIdsToRemove) {
    const playlistItemIds: string[] = yield select((state) =>
      selectNormPlaylistItemIdsByPlaylistId(state as never, playlistIdToRemove)
    );

    // remove playlists from normalized listToPlay
    yield put(
      ytplaylistNormedAction.deleteNormListToPlayItemsAction(playlistItemIds)
    );

    // delete playlists from normalized playlists
    yield put(
      ytplaylistNormedAction.deleteNormPlaylistByIdAction(playlistIdToRemove)
    );
  }
  // =============================================
  // End porting
  // ============================================
}

/**
 * Saga that listens to ADD_PLAYLISTS_TO_LIST_TO_PLAY action,
 * which then dispatch ADD_PLAYING_PLAYLISTS action,
 * APPEND_LIST_TO_PLAY action,
 * and SET_CHECKED_PLAYLISTS action
 *
 * NOTE: added logic to update normalized states as well
 *
 * @export
 * @param action
 */
export function* addPlaylistsToListToPlay(
  action: AddPlaylistsToListToPlayAction
) {
  const playlistIds = action.payload.playlistIds;

  if (playlistIds.length === 0) return;

  const playlists: Playlist[] = yield select(
    (state) => state.ytplaylist.playlists
  );
  const playlistItemsToAdd = playlists
    .filter((playlist) => playlistIds.includes(playlist.id))
    .flatMap((filteredPlaylist) => filteredPlaylist.items);

  // update playingPlaylists, listToPlay and checkedPlaylists respectively
  yield put(ytplaylistAction.addPlayingPlaylistsAction(playlistIds));
  yield put(ytplaylistAction.appendListToPlayAction(playlistItemsToAdd));
  yield put(ytplaylistAction.setCheckedPlaylistsAction([]));

  // =============================================
  // Porting to normalized states
  // =============================================
  // add each playlist and their respective items to normalized listToPlay
  for (const playlistId of playlistIds) {
    const playlistItemIds: string[] = yield select((state) =>
      selectNormPlaylistItemIdsByPlaylistId(state as never, playlistId)
    );

    yield put(
      ytplaylistNormedAction.addNormPlaylistToNormListToPlayAction(
        playlistId,
        playlistItemIds
      )
    );
  }

  // =============================================
  // End porting
  // =============================================
}

/**
 * Saga which listening for REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY action,
 * which in turn dispatch REMOVE_PLAYING_PLAYLISTS action to
 * clear playingPlaylists with notification for user,
 * then dispatch REMOVE_FROM_LIST_TO_PLAY action to remove
 * playlist items on listToPlay, and finally clear the checked
 * playlists on view
 *
 * NOTE: added logic to update normalized states as well
 *
 * @export
 * @param action
 */
export function* removePlaylistsFromListToPlay(
  action: RemovePlaylistsFromListToPlayAction
) {
  const playlistIdsToRemove = action.payload.playlistIds;
  const playlists: Playlist[] = yield select(
    (state) => state.ytplaylist.playlists
  );
  const playingPlaylists: string[] = yield select(
    (state) => state.ytplaylist.playingPlaylists
  );

  if (playlistIdsToRemove.length === 0)
    throw new Error("Playlist Ids array is empty. Nothing to remove");

  for (const playlistIdToRemove of playlistIdsToRemove) {
    const playlistToRemove = playlists.filter(
      (playlist) => playlist.id === playlistIdToRemove
    )[0];

    if (!playlistToRemove) {
      continue;
    }

    const playlistIdentifier = playlistToRemove.name || playlistIdToRemove;

    if (!playingPlaylists.includes(playlistIdToRemove)) {
      notify(
        "warning",
        `playlist: ${playlistIdentifier} is not included in playing`
      );

      continue;
    }

    yield put(
      ytplaylistAction.removePlayingPlaylistsAction([playlistIdToRemove])
    );

    // =============================================
    // Porting to normalized states
    // =============================================
    const playlistItemIds = yield select((state) =>
      selectNormPlaylistItemIdsByPlaylistId(state as never, playlistIdToRemove)
    );

    // remove playlist in normalized listToPlay and remove allInPlaying label
    yield put(
      ytplaylistNormedAction.removeNormPlaylistFromNormListToPlayAction(
        playlistIdToRemove,
        playlistItemIds
      )
    );
    // );
    // =============================================
    // End porting
    // =============================================

    // notify user if playlist(s) are removed from listToPlay and normalized listToPlay
    notify(
      "success",
      `Successfully removed selected playlist(s) from playing 😎`
    );
  }

  yield put(
    ytplaylistAction.removeFromListToPlayAction(
      playlistIdsToRemove,
      "playlists"
    )
  );
  yield put(ytplaylistAction.setCheckedPlaylistsAction([])); // clear checkedPlaylists
}

// =============================================
// Videos
// =============================================
/**
 * Saga which listening to DELETE_VIDEOS action, then dispatch
 * REMOVE_VIDEOS_FROM_LIST_TO_PLAY action to clear the residue
 *
 * NOTE: added logic to update normalized states as well
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

  // =============================================
  // Porting to normalized states
  // =============================================
  for (const videoIdToRemove of videoIdsToRemove) {
    const videoItemIds: string[] = yield select((state) =>
      selectNormVideoItemIdsByVideoId(state as never, videoIdToRemove)
    );

    // remove videos from normalized listToPlay
    yield put(
      ytplaylistNormedAction.deleteNormListToPlayItemsAction(videoItemIds)
    );

    // delete videos from normalized videos
    yield put(
      ytplaylistNormedAction.deleteNormVideoByIdAction(videoIdToRemove)
    );
  }
  // =============================================
  // End porting
  // ============================================
}

/**
 * Saga that listens to ADD_VIDEOS_TO_LIST_TO_PLAY action,
 * which then dispatch ADD_PLAYING_VIDEOS action,
 * APPEND_LIST_TO_PLAY action,
 * and SET_CHECKED_VIDEOS action
 *
 * NOTE: added logic to update normalized states as well
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

  // =============================================
  // Porting to normalized states
  // =============================================
  for (const videoId of videoIds) {
    const videoItemIds: string[] = yield select((state) =>
      selectNormVideoItemIdsByVideoId(state as never, videoId)
    );
    const videoItems = videoItemIds.map((videoItemId) => ({
      resultItem: {
        id: videoItemId,
        source: "videos" as MediaSourceType,
        schema: "videoItems" as SchemaType,
      },
      foreignKey: videoId,
    }));

    // add video to normalized listToPlay
    yield put(ytplaylistNormedAction.addNormListToPlayItemsAction(videoItems));
  }
  // =============================================
  // End porting
  // ============================================
}

/**
 * Saga which listening to REMOVE_VIDEOS_FROM_LIST_TO_PLAY action,
 * then it dispatches REMOVE_PLAYING_VIDEOS action,
 * REMOVE_FROM_LIST_TO_PLAY action and SET_CHECKED_VIDEOS action
 * subsequently
 *
 * NOTE: added logic to update normalized states as well
 *
 * @export
 * @param action
 */
export function* removeVideosFromListToPlay(
  action: RemoveVideosFromListToPlayAction
) {
  const videoIdsToRemove = action.payload.videoIds;
  const videos: Video[] = yield select((state) => state.ytplaylist.videos);
  const playingVideos: string[] = yield select(
    (state) => state.ytplaylist.playingVideos
  );

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

    // =============================================
    // Porting to normalized states
    // =============================================
    const videoItemIds: string[] = yield select((state) =>
      selectNormVideoItemIdsByVideoId(state as never, videoIdToRemove)
    );

    // remove video from normalized listToPlay
    yield put(
      ytplaylistNormedAction.deleteNormListToPlayItemsAction(videoItemIds)
    );

    // =============================================
    // End porting
    // ============================================

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
function* deletePlaylistsWatcher() {
  yield takeEvery(ActionTypes.DELETE_PLAYLISTS, deletePlaylists);
}

function* addPlaylistsToListToPlayWatcher() {
  yield takeEvery(
    ActionTypes.ADD_PLAYLISTS_TO_LIST_TO_PLAY,
    addPlaylistsToListToPlay
  );
}

function* removePlaylistsFromListToPlayWatcher() {
  yield takeEvery(
    ActionTypes.REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY,
    removePlaylistsFromListToPlay
  );
}

function* deleteVideosWatcher() {
  yield takeEvery(ActionTypes.DELETE_VIDEOS, deleteVideos);
}

function* addVideosToListToPlayWatcher() {
  yield takeEvery(
    ActionTypes.ADD_VIDEOS_TO_LIST_TO_PLAY,
    addVideosToListToPlay
  );
}

function* removeVideosFromListToPlayWatcher() {
  yield takeEvery(
    ActionTypes.REMOVE_VIDEOS_FROM_LIST_TO_PLAY,
    removeVideosFromListToPlay
  );
}

function* shuffleListToPlayWatcher() {
  while (true) {
    yield take(ActionTypes.SHUFFLE_LIST_TO_PLAY);
    const listToPlay: (PlaylistItem | VideoItem)[] = yield select(
      (state) => state.ytplaylist.listToPlay
    );

    if (listToPlay.length === 0) return;

    const shuffledListToPlay = shuffle(listToPlay);
    yield put(ytplaylistAction.updateListToPlayAction(shuffledListToPlay));
  }
}

export default function* ytplaylistSaga() {
  yield all([
    deletePlaylistsWatcher(),
    addPlaylistsToListToPlayWatcher(),
    removePlaylistsFromListToPlayWatcher(),
    deleteVideosWatcher(),
    addVideosToListToPlayWatcher(),
    removeVideosFromListToPlayWatcher(),
    shuffleListToPlayWatcher(),
  ]);
}
