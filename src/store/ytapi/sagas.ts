import { all, call, put, takeLatest } from "redux-saga/effects";
import * as schemas from "schemas";
import * as ytplaylistNormed from "store/ytplaylist/normAction";
import * as YTPlaylistTypes from "store/ytplaylist/types";
import { ActionType } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";
import { fetchYoutubeAPIData } from "utils/helper/fetchHelper";
import { notify } from "utils/helper/notifyHelper";

import * as ytapi from "./action";

type FetchPlaylistDataAction = ActionType<typeof ytapi.fetchPlaylistDataAction>;
type FetchVideoDataAction = ActionType<typeof ytapi.fetchVideoDataAction>;

// ====================================================
// Helper sagas
// ====================================================
/**
 * Helper function to add items to normalized listToPlay
 *
 * @export
 * @param items Playlist/video items before normalized
 */
export function* addFetchItemsToNormListToPlay(
  items: (YTPlaylistTypes.PlaylistItem | YTPlaylistTypes.VideoItem)[]
) {
  const {
    entities: listToPlayEntities,
    result: listToPlayResult,
  } = schemas.normalizeListToPlay(items);

  yield put(
    ytplaylistNormed.addNormListToPlayAction(
      listToPlayEntities,
      listToPlayResult
    )
  );
}

/**
 * Helper function to add fetched playlists to normalized playlists state
 *
 * @export
 * @param playlist Playlist data
 */
export function* addFetchedNormPlaylist(playlist: YTPlaylistTypes.Playlist) {
  const {
    entities: playlistEntities,
    result: playlistResult,
  } = schemas.normalizePlaylists([playlist]);
  const playlistId = playlistResult[0];

  if (playlistResult.length === 0 || playlistResult.length > 1)
    throw new Error("Saga: No or more than one playlist is found");

  // add playlist
  yield put(
    ytplaylistNormed.addNormPlaylistAction(playlistEntities, playlistResult)
  );

  // add all fetched playlist's items to listToPlay
  // and label the playlist as playing (all playlistItems in listToPlay)
  yield call(addFetchItemsToNormListToPlay, playlist.items);

  yield put(ytplaylistNormed.addAllInPlayingLabelByIdAction(playlistId));
}

/**
 * Add fetched video to normalized videos state
 *
 * @export
 * @param video Video data
 */
export function* addFetchedNormVideo(video: YTPlaylistTypes.Video) {
  const {
    entities: videoEntities,
    result: videoResult,
  } = schemas.normalizeVideos([video]);

  if (videoResult.length === 0 || videoResult.length > 1)
    throw new Error("Saga: No or more than one video is found");

  // add video
  yield put(ytplaylistNormed.addNormVideoAction(videoEntities, videoResult));

  // add fetched video items to listToPlay
  yield call(addFetchItemsToNormListToPlay, video.items);
}

export function* fetchPlaylistDataSuccess(
  dataItems: YTPlaylistTypes.PlaylistItem[]
) {
  const items = Array.from(dataItems);
  const id = items[0].snippet.playlistId;
  const fetchedPlaylist: YTPlaylistTypes.Playlist = {
    id,
    items,
  };

  yield put(ytapi.fetchPlaylistDataSuccessAction(fetchedPlaylist));

  // add playlist to normalized playlists
  yield call(addFetchedNormPlaylist, fetchedPlaylist);

  // add fetched playlist's id to redux store
  yield put(ytapi.addFetchedPlaylistIdAction(id));
}

export function* fetchVideoDataSuccess(data: YTPlaylistTypes.Video) {
  const items = Array.from(data.items);
  const id = items[0].id;
  const fetchedVideo = {
    id,
    items,
  };

  yield put(ytapi.fetchVideoDataSuccessAction(data));

  // add fetched video to normalized videos
  yield call(addFetchedNormVideo, fetchedVideo);

  // add fetched video's id to redux store
  yield put(ytapi.addFetchedVideoIdAction(id));
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
    let count = 2;
    const items = [];

    let data: YTPlaylistTypes.Playlist = yield call(
      fetchYoutubeAPIData,
      url,
      params,
      "playlists"
    );
    items.push(...data.items);

    while (data.nextPageToken) {
      if (count > 5) {
        alert(
          "Number of videos in your playlist exceeded limit set by us (250 videos/playlist)"
        );
        break;
      }

      data = yield call(
        fetchYoutubeAPIData,
        url,
        {
          ...params,
          pageToken: data.nextPageToken,
        },
        "playlists"
      );
      items.push(...data.items);
      count++;
    }

    if (
      ((Array.isArray && Array.isArray(items)) || items instanceof Array) &&
      items.length === 0
    )
      throw new Error("Fetch Playlist Failed: Empty Response");

    yield call(fetchPlaylistDataSuccess, items);
  } catch (err) {
    yield put(ytapi.fetchPlaylistDataFailedAction());
    console.error(`Error in fetchPlaylistData: ${err}`);
    notify("error", "❌ Error in searching playlist!");
  } finally {
    // clear playlist url either success or failed
    yield put(ytapi.setPlaylistUrlAction(""));
  }
}

/**
 * Fetching videos information asynchronously from API to Redux
 * @param action
 */
export function* fetchVideoData(action: FetchVideoDataAction) {
  const { url, params } = action.payload;
  try {
    const data: YTPlaylistTypes.Video = yield call(
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
    yield put(ytapi.fetchVideoDataFailedAction());
    console.error(`Error in fetchVideoData: ${err}`);
    notify("error", "❌ Error in searching video!");
  } finally {
    // clear video url either success or failed
    yield put(ytapi.setVideoUrlAction(""));
  }
}

// ====================================================
// Saga Watchers
// ====================================================
function* fetchPlaylistDataWatcher() {
  yield takeLatest(ActionTypes.FETCH_PLAYLIST_DATA, fetchPlaylistData);
}

function* fetchVideoDataWatcher() {
  yield takeLatest(ActionTypes.FETCH_VIDEO_DATA, fetchVideoData);
}

export default function* ytapiSaga() {
  yield all([fetchPlaylistDataWatcher(), fetchVideoDataWatcher()]);
}
