import { take, takeEvery, put, all, select } from "redux-saga/effects";
import shuffle from "lodash.shuffle";
import {
  DELETE_PLAYLISTS,
  REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY,
  DELETE_VIDEOS,
  REMOVE_VIDEOS_FROM_LIST_TO_PLAY,
  SHUFFLE_LIST_TO_PLAY,
  ADD_PLAYLISTS_TO_LIST_TO_PLAY,
  ADD_VIDEOS_TO_LIST_TO_PLAY,
  TOGGLE_PLAYING_VIDEO,
} from "../../utils/constants/actionConstants";
import {
  removePlayingPlaylistsAction,
  removePlayingVideosAction,
  setCheckedPlaylistsAction,
  setCheckedVideosAction,
  removePlaylistsFromListToPlayAction,
  removeVideosFromListToPlayAction,
  updateListToPlay,
  removeFromListToPlayAction,
  appendListToPlayAction,
  addPlayingPlaylistsAction,
  addPlayingVideosAction,
  addVideosToListToPlayAction,
} from "./action";
import { notify } from "../../utils/helper/notifyHelper";

// =============================================
// Playlist
// =============================================

/**
 * Saga which listening for DELETE_PLAYLISTS action,
 * which in turn dispatch REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY
 * action to clear any possible leftover on playingPlaylists
 * and listToPlay
 *
 * @export
 * @param {DeletePlaylistsAction} action
 */
export function* deletePlaylists(action) {
  const playlistIdsToRemove = action.payload.playlistIds;

  if (Array.isArray && !Array.isArray(playlistIdsToRemove))
    throw new Error("deletePlaylists: Args supplied is not an array");

  // call REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY action after deleting playlist(s) from redux
  yield put(removePlaylistsFromListToPlayAction(playlistIdsToRemove));
}

/**
 * Saga that listens to ADD_PLAYLISTS_TO_LIST_TO_PLAY action,
 * which then dispatch ADD_PLAYING_PLAYLISTS action,
 * APPEND_LIST_TO_PLAY action,
 * and SET_CHECKED_PLAYLISTS action
 *
 * @export
 * @param {AddPlaylistsToListToPlayAction} action
 */
export function* addPlaylistsToListToPlay(action) {
  const playlistIds = action.payload.playlistIds;

  if (playlistIds.length === 0) return;

  /** @type {Array<Playlist>} */
  const playlists = yield select((state) => state.ytplaylist.playlists);
  const playlistItemsToAdd = playlists
    .filter((playlist) => playlistIds.includes(playlist.id))
    .map((filteredPlaylist) => filteredPlaylist.items)
    .reduce((acc, val) => acc.concat(val), []);

  // update playingPlaylists, listToPlay and checkedPlaylists respectively
  yield put(addPlayingPlaylistsAction(playlistIds));
  yield put(appendListToPlayAction(playlistItemsToAdd));
  yield put(setCheckedPlaylistsAction([]));
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
 * @param {RemovePlaylistsFromListToPlayAction} action
 */
export function* removePlaylistsFromListToPlay(action) {
  const playlistIdsToRemove = action.payload.playlistIds;
  /** @type {Array<Playlist>} */
  const playlists = yield select((state) => state.ytplaylist.playlists);
  /** @type {Array<string>} */
  const playingPlaylists = yield select(
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

    yield put(removePlayingPlaylistsAction([playlistIdToRemove]));

    // only notify user if the user is removing playlist from listToPlay
    // instead of deleting playlist
    if (playlistToRemove) {
      notify(
        "success",
        `Successfully removed playlist: ${playlistIdentifier} from playing 😎`
      );
    }
  }

  yield put(removeFromListToPlayAction(playlistIdsToRemove, "playlist"));
  yield put(setCheckedPlaylistsAction([])); // clear checkedPlaylists
}

// =============================================
// Videos
// =============================================
/**
 * Saga which listening to DELETE_VIDEOS action, then dispatch
 * REMOVE_VIDEOS_FROM_LIST_TO_PLAY action to clear the residue
 *
 * @export
 * @param {DeleteVideosAction} action
 */
export function* deleteVideos(action) {
  const videoIdsToRemove = action.payload.videoIds;

  if (Array.isArray && !Array.isArray(videoIdsToRemove))
    throw new Error("deleteVideos: Args supplied is not an array");

  // call REMOVE_VIDEOS_FROM_LIST_TO_PLAY action after deleting video(s) from redux
  yield put(removeVideosFromListToPlayAction(videoIdsToRemove));
}

/**
 * Saga that listens to ADD_VIDEOS_TO_LIST_TO_PLAY action,
 * which then dispatch ADD_PLAYING_VIDEOS action,
 * APPEND_LIST_TO_PLAY action,
 * and SET_CHECKED_VIDEOS action
 *
 * @export
 * @param {AddVideosToListToPlayAction} action
 */
export function* addVideosToListToPlay(action) {
  const videoIds = action.payload.videoIds;

  if (videoIds.length === 0) return;

  /** @type {Array<Video>} */
  const videos = yield select((state) => state.ytplaylist.videos);
  const videoItemsToAdd = videos
    .filter((video) => videoIds.includes(video.id))
    .map((filteredVideo) => filteredVideo.items)
    .reduce((acc, val) => acc.concat(val), []);

  // update playingVideos, listToPlay and checkedVideos respectively
  yield put(addPlayingVideosAction(videoIds));
  yield put(appendListToPlayAction(videoItemsToAdd));
  yield put(setCheckedVideosAction([]));
}

/**
 * Saga which listening to REMOVE_VIDEOS_FROM_LIST_TO_PLAY action,
 * then it dispatches REMOVE_PLAYING_VIDEOS action,
 * REMOVE_FROM_LIST_TO_PLAY action and SET_CHECKED_VIDEOS action
 * subsequently
 *
 * @export
 * @param {RemoveVideosFromListToPlayAction} action
 */
export function* removeVideosFromListToPlay(action) {
  const videoIdsToRemove = action.payload.videoIds;
  /** @type {Array<Video>} */
  const videos = yield select((state) => state.ytplaylist.videos);
  /** @type {Array<string>} */
  const playingVideos = yield select((state) => state.ytplaylist.playingVideos);

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

    yield put(removePlayingVideosAction([videoIdToRemove]));

    // only notify user if the user is removing video from listToPlay
    // instead of deleting it
    if (videoToRemove) {
      notify(
        "success",
        `Successfully removed video: ${videoIdentifier} from playing 😎`
      );
    }
  }

  yield put(removeFromListToPlayAction(videoIdsToRemove, "video"));
  yield put(setCheckedVideosAction([])); // clear checkedVideos
}

/**
 * Toggle add or remove video from listToPlay
 *
 * @exports
 * @param {TogglePlayingVideoAction} action
 *
 */
export function* togglePlayingVideo(action) {
  const videoId = action.payload.videoId;
  /** @type {Array<string>} */
  const playingVideos = yield select((state) => state.ytplaylist.playingVideos);

  const isPlayingVideoPreviously = playingVideos.includes(videoId);

  // update playingVideos array accordingly
  if (isPlayingVideoPreviously) {
    yield put(removeVideosFromListToPlayAction([videoId]));
  } else {
    yield put(addVideosToListToPlayAction([videoId]));
  }
}

// =============================================
// Saga Watchers
// =============================================
function* deletePlaylistsWatcher() {
  yield takeEvery(DELETE_PLAYLISTS, deletePlaylists);
}

function* addPlaylistsToListToPlayWatcher() {
  yield takeEvery(ADD_PLAYLISTS_TO_LIST_TO_PLAY, addPlaylistsToListToPlay);
}

function* removePlaylistsFromListToPlayWatcher() {
  yield takeEvery(
    REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY,
    removePlaylistsFromListToPlay
  );
}

function* deleteVideosWatcher() {
  yield takeEvery(DELETE_VIDEOS, deleteVideos);
}

function* addVideosToListToPlayWatcher() {
  yield takeEvery(ADD_VIDEOS_TO_LIST_TO_PLAY, addVideosToListToPlay);
}

function* removeVideosFromListToPlayWatcher() {
  yield takeEvery(REMOVE_VIDEOS_FROM_LIST_TO_PLAY, removeVideosFromListToPlay);
}

function* togglePlayingVideoWatcher() {
  yield takeEvery(TOGGLE_PLAYING_VIDEO, togglePlayingVideo);
}

function* shuffleListToPlayWatcher() {
  while (true) {
    yield take(SHUFFLE_LIST_TO_PLAY);
    /** @type {ListToPlay} */
    // @ts-ignore
    const listToPlay = yield select((state) => state.ytplaylist.listToPlay);

    if (listToPlay.length === 0) return;

    const shuffledListToPlay = shuffle(listToPlay);
    yield put(updateListToPlay(shuffledListToPlay));
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
