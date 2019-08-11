import shuffle from "lodash/shuffle";
import { all, put, select, take, takeEvery } from "redux-saga/effects";
import { ActionType } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";
import { notify } from "utils/helper/notifyHelper";

import * as ytplaylistAction from "./action";
import {
  selectListToPlay,
  selectPlayingPlaylists,
  selectPlayingVideos,
  selectPlaylists,
  selectVideos,
} from "./selector";
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
 * @deprecated Remove as of next stable version (v4.0)
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
}

/**
 * Saga that listens to ADD_PLAYLISTS_TO_LIST_TO_PLAY action,
 * which then dispatch ADD_PLAYING_PLAYLISTS action,
 * APPEND_LIST_TO_PLAY action,
 * and SET_CHECKED_PLAYLISTS action
 *
 * @deprecated Remove as of next stable version (v4.0)
 *
 * @export
 * @param action
 */
export function* addPlaylistsToListToPlay(
  action: AddPlaylistsToListToPlayAction
) {
  const playlistIds = action.payload.playlistIds;

  if (playlistIds.length === 0) return;

  const playlists: Playlist[] = yield select(selectPlaylists);
  const playlistItemsToAdd = playlists
    .filter((playlist) => playlistIds.includes(playlist.id))
    .flatMap((filteredPlaylist) => filteredPlaylist.items);

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
 * @deprecated Remove as of next stable version (v4.0)
 *
 * @export
 * @param action
 */
export function* removePlaylistsFromListToPlay(
  action: RemovePlaylistsFromListToPlayAction
) {
  const playlistIdsToRemove = action.payload.playlistIds;
  const playlists: Playlist[] = yield select(selectPlaylists);
  const playingPlaylists: string[] = yield select(selectPlayingPlaylists);

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
function* deletePlaylistsWatcher() {
  yield takeEvery(ActionTypes.DELETE_PLAYLISTS, deletePlaylists);
}

/**
 * @deprecated Remove as of next stable version (v4.0)
 */
function* addPlaylistsToListToPlayWatcher() {
  yield takeEvery(
    ActionTypes.ADD_PLAYLISTS_TO_LIST_TO_PLAY,
    addPlaylistsToListToPlay
  );
}

/**
 * @deprecated Remove as of next stable version (v4.0)
 */
function* removePlaylistsFromListToPlayWatcher() {
  yield takeEvery(
    ActionTypes.REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY,
    removePlaylistsFromListToPlay
  );
}

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

function* shuffleListToPlayWatcher() {
  while (true) {
    yield take(ActionTypes.SHUFFLE_LIST_TO_PLAY);
    const listToPlay: (PlaylistItem | VideoItem)[] = yield select(
      selectListToPlay
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
