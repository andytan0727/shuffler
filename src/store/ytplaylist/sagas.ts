import shuffle from "lodash/shuffle";
import { all, put, select, take, takeEvery } from "redux-saga/effects";
import { ActionType } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";
import { notify } from "utils/helper/notifyHelper";

import * as ytplaylistAction from "./action";
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
type TogglePlayingVideoAction = ActionType<
  typeof ytplaylistAction.togglePlayingVideoAction
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
 * @export
 * @param action
 */
export function* deletePlaylists(action: DeletePlaylistsAction) {
  const playlistIdsToRemove = action.payload.playlistIds;

  if (Array.isArray && !Array.isArray(playlistIdsToRemove))
    throw new Error("deletePlaylists: Args supplied is not an array");

  // call REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY action after deleting playlist(s) from redux
  yield put(
    ytplaylistAction.removePlaylistsFromListToPlayAction(playlistIdsToRemove)
  );
}

/**
 * Saga that listens to ADD_PLAYLISTS_TO_LIST_TO_PLAY action,
 * which then dispatch ADD_PLAYING_PLAYLISTS action,
 * APPEND_LIST_TO_PLAY action,
 * and SET_CHECKED_PLAYLISTS action
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
    .map((filteredPlaylist) => filteredPlaylist.items)
    .reduce((acc, val) => acc.concat(val), []);

  // update playingPlaylists, listToPlay and checkedPlaylists respectively
  yield put(ytplaylistAction.addPlayingPlaylistsAction(playlistIds));
  yield put(ytplaylistAction.appendListToPlayAction(playlistItemsToAdd));
  yield put(ytplaylistAction.setCheckedPlaylistsAction([]));
}

/**
 * Saga which listening for REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY action,
 * which in turn dispatch REMOVE_PLAYING_PLAYLISTS action to
 * clear playingPlaylists with notification for user,
 * then dispatch REMOVE_FROM_LIST_TO_PLAY action to remove
 * playlist items on listToPlay, and finally clear the checked
 * playlists on view
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

  if (playlistIdsToRemove.length === 0) return;

  for (const playlistIdToRemove of playlistIdsToRemove) {
    const playlistToRemove = playlists.filter(
      (playlist) => playlist.id === playlistIdToRemove
    )[0];
    const playlistIdentifier =
      (playlistToRemove && playlistToRemove.name) || playlistIdToRemove;

    if (!playingPlaylists.includes(playlistIdToRemove)) {
      if (playlistToRemove) {
        notify(
          "warning",
          `playlist: ${playlistIdentifier} is not included in playing`
        );
      }

      continue;
    }

    yield put(
      ytplaylistAction.removePlayingPlaylistsAction([playlistIdToRemove])
    );

    // only notify user if the user is removing playlist from listToPlay
    // instead of deleting playlist
    if (playlistToRemove) {
      notify(
        "success",
        `Successfully removed playlist: ${playlistIdentifier} from playing 😎`
      );
    }
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
 * @export
 * @param action
 */
export function* deleteVideos(action: DeleteVideosAction) {
  const videoIdsToRemove = action.payload.videoIds;

  if (Array.isArray && !Array.isArray(videoIdsToRemove))
    throw new Error("deleteVideos: Args supplied is not an array");

  // call REMOVE_VIDEOS_FROM_LIST_TO_PLAY action after deleting video(s) from redux
  yield put(
    ytplaylistAction.removeVideosFromListToPlayAction(videoIdsToRemove)
  );
}

/**
 * Saga that listens to ADD_VIDEOS_TO_LIST_TO_PLAY action,
 * which then dispatch ADD_PLAYING_VIDEOS action,
 * APPEND_LIST_TO_PLAY action,
 * and SET_CHECKED_VIDEOS action
 *
 * @export
 * @param action
 */
export function* addVideosToListToPlay(action: AddVideosToListToPlayAction) {
  const videoIds = action.payload.videoIds;

  if (videoIds.length === 0) return;

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
    const videoIdentifier =
      (videoToRemove &&
        videoToRemove.items[0] &&
        videoToRemove.items[0].snippet.title) ||
      videoIdToRemove;

    if (!playingVideos.includes(videoIdToRemove)) {
      if (videoToRemove) {
        notify(
          "warning",
          `video: ${videoIdentifier} is not included in playing`
        );
      }

      continue;
    }

    yield put(ytplaylistAction.removePlayingVideosAction([videoIdToRemove]));

    // only notify user if the user is removing video from listToPlay
    // instead of deleting it
    if (videoToRemove) {
      notify(
        "success",
        `Successfully removed video: ${videoIdentifier} from playing 😎`
      );
    }
  }

  yield put(
    ytplaylistAction.removeFromListToPlayAction(videoIdsToRemove, "videos")
  );
  yield put(ytplaylistAction.setCheckedVideosAction([])); // clear checkedVideos
}

/**
 * Toggle add or remove video from listToPlay
 *
 * @exports
 * @param action
 *
 */
export function* togglePlayingVideo(action: TogglePlayingVideoAction) {
  const videoId = action.payload.videoId;
  const playingVideos: string[] = yield select(
    (state) => state.ytplaylist.playingVideos
  );

  const isPlayingVideoPreviously = playingVideos.includes(videoId);

  // update playingVideos array accordingly
  if (isPlayingVideoPreviously) {
    yield put(ytplaylistAction.removeVideosFromListToPlayAction([videoId]));
  } else {
    yield put(ytplaylistAction.addVideosToListToPlayAction([videoId]));
  }
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

function* togglePlayingVideoWatcher() {
  yield takeEvery(ActionTypes.TOGGLE_PLAYING_VIDEO, togglePlayingVideo);
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
    togglePlayingVideoWatcher(),
    shuffleListToPlayWatcher(),
  ]);
}
