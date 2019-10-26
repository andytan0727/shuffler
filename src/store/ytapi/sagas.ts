import { all, call, put, takeLatest } from "redux-saga/effects";
import {
  normalizeListToPlay,
  normalizePlaylists,
  normalizeVideos,
} from "schemas";
import * as listToPlayActions from "store/ytplaylist/listToPlayActions";
import * as playlistActions from "store/ytplaylist/playlistActions";
import * as YTPlaylistTypes from "store/ytplaylist/types";
import * as videoActions from "store/ytplaylist/videoActions";
import { ActionType } from "typesafe-actions";
import {
  FETCH_PLAYLIST_DATA,
  FETCH_VIDEO_DATA,
} from "utils/constants/actionConstants";
import {
  fetchYoutubeAPIData,
  recursivelyFetchPlaylistData,
} from "utils/helper/fetchHelper";
import { notify } from "utils/helper/notifyHelper";

import * as ytapiActions from "./action";

type FetchPlaylistDataAction = ActionType<
  typeof ytapiActions.fetchPlaylistDataAction
>;
type FetchVideoDataAction = ActionType<
  typeof ytapiActions.fetchVideoDataAction
>;

// ====================================================
// Helper sagas
// ====================================================
/**
 * Helper function to add items to listToPlay
 *
 * @export
 * @param items Playlist/video items before normalized
 */
export function* addFetchItemsToListToPlay(
  items: (YTPlaylistTypes.PlaylistItem | YTPlaylistTypes.VideoItem)[]
) {
  const {
    entities: listToPlayEntities,
    result: listToPlayResult,
  } = normalizeListToPlay(items);

  yield put(
    listToPlayActions.addListToPlayAction(listToPlayEntities, listToPlayResult)
  );
}

/**
 * Helper function to add fetched playlists to playlists state
 *
 * @export
 * @param playlist Playlist data
 */
export function* addFetchedPlaylist(playlist: YTPlaylistTypes.FetchedPlaylist) {
  const {
    entities: playlistEntities,
    result: playlistResult,
  } = normalizePlaylists([playlist]);
  const playlistId = playlistResult[0];

  if (playlistResult.length === 0 || playlistResult.length > 1)
    throw new Error("Saga: No or more than one playlist is found");

  // add playlist
  yield put(
    playlistActions.addPlaylistAction(playlistEntities, playlistResult)
  );

  // add all fetched playlist's items to listToPlay
  // and label the playlist as playing (all playlistItems in listToPlay)
  yield call(addFetchItemsToListToPlay, playlist.items);

  yield put(playlistActions.addAllInPlayingLabelByIdAction(playlistId));
}

/**
 * Add fetched video to videos state
 *
 * @export
 * @param video FetchedVideo data
 */
export function* addFetchedVideo(video: YTPlaylistTypes.FetchedVideo) {
  const { entities: videoEntities, result: videoResult } = normalizeVideos([
    video,
  ]);

  if (videoResult.length === 0 || videoResult.length > 1)
    throw new Error("Saga: No or more than one video is found");

  // add video
  yield put(videoActions.addVideoAction(videoEntities, videoResult));

  // add fetched video items to listToPlay
  yield call(addFetchItemsToListToPlay, video.items);
}

export function* fetchPlaylistDataSuccess(
  dataItems: YTPlaylistTypes.PlaylistItem[]
) {
  const items = Array.from(dataItems);
  const id = items[0].snippet.playlistId;
  const fetchedPlaylist: YTPlaylistTypes.FetchedPlaylist = {
    id,
    items,
  };

  yield put(ytapiActions.fetchPlaylistDataSuccessAction(fetchedPlaylist));

  yield call(addFetchedPlaylist, fetchedPlaylist);

  // add fetched playlist's id to redux store
  yield put(ytapiActions.addFetchedPlaylistIdAction(id));
}

export function* fetchVideoDataSuccess(data: YTPlaylistTypes.FetchedVideo) {
  const items = Array.from(data.items);
  const id = items[0].id;
  const fetchedVideo = {
    id,
    items,
  };

  yield put(ytapiActions.fetchVideoDataSuccessAction(data));

  yield call(addFetchedVideo, fetchedVideo);

  // add fetched video's id to redux store
  yield put(ytapiActions.addFetchedVideoIdAction(id));
}
// ====================================================

// ====================================================
// Main saga which listen for API fetching action
// ====================================================
/**
 * Fetching videos information asynchronously from API to Redux
 * @param action
 */
export function* fetchPlaylistData(action: FetchPlaylistDataAction) {
  const { url, params } = action.payload;
  try {
    const items: YTPlaylistTypes.PlaylistItem[] = yield call(
      recursivelyFetchPlaylistData,
      url,
      params
    );

    if (
      ((Array.isArray && Array.isArray(items)) || items instanceof Array) &&
      items.length === 0
    )
      throw new Error("Fetch Playlist Failed: Empty Response");

    yield call(fetchPlaylistDataSuccess, items);
  } catch (err) {
    yield put(ytapiActions.fetchPlaylistDataFailedAction());
    console.error(`Error in fetchPlaylistData: ${err}`);
    notify("error", "❌ Error in searching playlist!");
  } finally {
    // clear playlist url either success or failed
    yield put(ytapiActions.setPlaylistUrlAction(""));
  }
}

/**
 * Fetching videos information asynchronously from API to Redux
 * @param action
 */
export function* fetchVideoData(action: FetchVideoDataAction) {
  const { url, params } = action.payload;
  try {
    const data: YTPlaylistTypes.FetchedVideo = yield call(
      fetchYoutubeAPIData,
      url,
      params,
      "videos"
    );

    if (
      ((Array.isArray && Array.isArray(data.items)) ||
        data.items instanceof Array) &&
      data.items.length === 0
    )
      throw new Error("Fetch Video Failed: Empty Response");

    yield call(fetchVideoDataSuccess, data);
  } catch (err) {
    yield put(ytapiActions.fetchVideoDataFailedAction());
    console.error(`Error in fetchVideoData: ${err}`);
    notify("error", "❌ Error in searching video!");
  } finally {
    // clear video url either success or failed
    yield put(ytapiActions.setVideoUrlAction(""));
  }
}

// ====================================================
// Saga Watchers
// ====================================================
function* fetchPlaylistDataWatcher() {
  yield takeLatest(FETCH_PLAYLIST_DATA, fetchPlaylistData);
}

function* fetchVideoDataWatcher() {
  yield takeLatest(FETCH_VIDEO_DATA, fetchVideoData);
}

export default function* ytapiSaga() {
  yield all([fetchPlaylistDataWatcher(), fetchVideoDataWatcher()]);
}
