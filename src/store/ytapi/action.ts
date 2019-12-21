import { FetchedPlaylist, FetchedVideo } from "store/ytplaylist/types";
import { createAction } from "typesafe-actions";
import {
  ADD_FETCHED_PLAYLIST_ID,
  ADD_FETCHED_VIDEO_ID,
  FETCH_PLAYLIST_DATA,
  FETCH_PLAYLIST_DATA_FAILED,
  FETCH_PLAYLIST_DATA_SUCCESS,
  FETCH_VIDEO_DATA,
  FETCH_VIDEO_DATA_FAILED,
  FETCH_VIDEO_DATA_SUCCESS,
  SET_PLAYLIST_URL,
  SET_VIDEO_URL,
} from "utils/constants/actionConstants";

/**
 * Add fetched playlist asynchronously to Redux
 * @param url Base url for HTTP request
 * @param params Extra params for request
 * @returns FETCH_PLAYLIST_DATA action object
 */
export const fetchPlaylistDataAction = createAction(
  FETCH_PLAYLIST_DATA,
  (url: string, params: FetchParams) => ({
    url,
    params,
  })
)();

/**
 * Executes when successfully fetched playlist data from YouTube Data API
 *
 * @param data Data obtained from YouTube Data API
 * @returns FETCH_PLAYLIST_DATA_SUCCESS action object
 */
export const fetchPlaylistDataSuccessAction = createAction(
  FETCH_PLAYLIST_DATA_SUCCESS,
  (data: FetchedPlaylist) => ({
    data,
  })
)();

/**
 * Executes when failed to fetch playlist data from YouTube Data API
 *
 * @returns FETCH_PLAYLIST_DATA_FAILED action object
 */
export const fetchPlaylistDataFailedAction = createAction(
  FETCH_PLAYLIST_DATA_FAILED
)();

/**
 * Add fetched playlist's to Redux store
 * @param id Fetched playlist id
 * @returns ADD_FETCHED_PLAYLIST_ID action object
 */
export const addFetchedPlaylistIdAction = createAction(
  ADD_FETCHED_PLAYLIST_ID,
  (id: string) => ({
    id,
  })
)();

/**
 * Set given playlist URL
 *
 * @param playlistUrl
 * @return SET_PLAYLIST_URL action object for Redux
 */
export const setPlaylistUrlAction = createAction(
  SET_PLAYLIST_URL,
  (playlistUrl: string) => ({
    playlistUrl,
  })
)();

/**
 * Fetching videos information asynchronously from API to Redux
 * @param url Base url for HTTP request
 * @param params Extra params for request
 * @returns FETCH_VIDEO_DATA action object
 */
export const fetchVideoDataAction = createAction(
  FETCH_VIDEO_DATA,
  (url: string, params: FetchParams) => ({
    url,
    params,
  })
)();

/**
 * Executes when successfully fetched video data from YouTube Data API
 *
 * @param data Data obtained from YouTube Data API
 * @returns FETCH_VIDEO_DATA_SUCCESS action object
 */
export const fetchVideoDataSuccessAction = createAction(
  FETCH_VIDEO_DATA_SUCCESS,
  (data: FetchedVideo) => ({
    data,
  })
)();

/**
 * Executes when failed to fetch video data from YouTube Data API
 *
 * @returns FETCH_VIDEO_DATA_FAILED action object
 */
export const fetchVideoDataFailedAction = createAction(
  FETCH_VIDEO_DATA_FAILED
)();

/**
 * Add fetched video id to ytapi redux store
 *
 * @param id
 * @returns ADD_FETCHED_VIDEO_ID action object
 */
export const addFetchedVideoIdAction = createAction(
  ADD_FETCHED_VIDEO_ID,
  (id: string) => ({
    id,
  })
)();

/**
 * Set given video URL
 *
 * @param videoUrl
 * @return SET_VIDEO_URL action object for Redux
 */
export const setVideoUrlAction = createAction(
  SET_VIDEO_URL,
  (videoUrl: string) => ({
    videoUrl,
  })
)();
