import { createAction } from "typesafe-actions";
import * as ActionTypes from "../../utils/constants/actionConstants";
import { Playlist, Video } from "store/ytplaylist/types";

/**
 * Add fetched playlist asynchronously to Redux
 * @param url Base url for HTTP request
 * @param params Extra params for request
 * @returns FETCH_PLAYLIST_DATA action object
 */
export const fetchPlaylistDataAction = createAction(
  ActionTypes.FETCH_PLAYLIST_DATA,
  (action) => {
    return (url: string, params: FetchParams) =>
      action({
        url,
        params,
      });
  }
);

/**
 * Executes when successfully fetched playlist data from YouTube Data API
 *
 * @param data Data obtained from YouTube Data API
 * @returns FETCH_PLAYLIST_DATA_SUCCESS action object
 */
export const fetchPlaylistDataSuccessAction = createAction(
  ActionTypes.FETCH_PLAYLIST_DATA_SUCCESS,
  (action) => {
    return (data: Playlist) =>
      action({
        data,
      });
  }
);

/**
 * Executes when failed to fetch playlist data from YouTube Data API
 *
 * @returns FETCH_PLAYLIST_DATA_FAILED action object
 */
export const fetchPlaylistDataFailedAction = createAction(
  ActionTypes.FETCH_PLAYLIST_DATA_FAILED
);

/**
 * Add fetched playlist's to Redux store
 * @param id Fetched playlist id
 * @returns ADD_FETCHED_PLAYLIST_ID action object
 */
export const addFetchedPlaylistIdAction = createAction(
  ActionTypes.ADD_FETCHED_PLAYLIST_ID,
  (action) => {
    return (id: string) =>
      action({
        id,
      });
  }
);

/**
 * Set given playlist URL
 *
 * @param playlistUrl
 * @return SET_PLAYLIST_URL action object for Redux
 */
export const setPlaylistUrlAction = createAction(
  ActionTypes.SET_PLAYLIST_URL,
  (action) => {
    return (playlistUrl: string) =>
      action({
        playlistUrl,
      });
  }
);

/**
 * Fetching videos information asynchronously from API to Redux
 * @param url Base url for HTTP request
 * @param params Extra params for request
 * @returns FETCH_VIDEO_DATA action object
 */
export const fetchVideoDataAction = createAction(
  ActionTypes.FETCH_VIDEO_DATA,
  (action) => {
    return (url: string, params: FetchParams) =>
      action({
        url,
        params,
      });
  }
);

/**
 * Executes when successfully fetched video data from YouTube Data API
 *
 * @param data Data obtained from YouTube Data API
 * @returns FETCH_VIDEO_DATA_SUCCESS action object
 */
export const fetchVideoDataSuccessAction = createAction(
  ActionTypes.FETCH_VIDEO_DATA_SUCCESS,
  (action) => {
    return (data: Video) =>
      action({
        data,
      });
  }
);

/**
 * Executes when failed to fetch video data from YouTube Data API
 *
 * @returns FETCH_VIDEO_DATA_FAILED action object
 */
export const fetchVideoDataFailedAction = createAction(
  ActionTypes.FETCH_VIDEO_DATA_FAILED
);

/**
 * Add fetched video id to ytapi redux store
 *
 * @param id
 * @returns ADD_FETCHED_VIDEO_ID action object
 */
export const addFetchedVideoIdAction = createAction(
  ActionTypes.ADD_FETCHED_VIDEO_ID,
  (action) => {
    return (id: string) =>
      action({
        id,
      });
  }
);

/**
 * Set given video URL
 *
 * @param videoUrl
 * @return SET_VIDEO_URL action object for Redux
 */
export const setVideoUrlAction = createAction(
  ActionTypes.SET_VIDEO_URL,
  (action) => {
    return (videoUrl: string) =>
      action({
        videoUrl,
      });
  }
);
