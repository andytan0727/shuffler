import {
  FETCH_PLAYLIST_DATA,
  FETCH_PLAYLIST_DATA_SUCCESS,
  FETCH_PLAYLIST_DATA_FAILED,
  ADD_FETCHED_PLAYLIST_ID,
  SET_PLAYLIST_URL,
  FETCH_VIDEO_DATA,
  FETCH_VIDEO_DATA_SUCCESS,
  FETCH_VIDEO_DATA_FAILED,
  ADD_FETCHED_VIDEO_ID,
  SET_VIDEO_URL,
} from "../../utils/constants/actionConstants";

/**
 * Add fetched playlist asynchronously to Redux
 * @param {string} url Base url for HTTP request
 * @param {FetchParams} params Extra params for request
 * @returns FETCH_PLAYLIST_DATA action object
 */
export const fetchPlaylistDataAction = (url, params) => ({
  type: FETCH_PLAYLIST_DATA,
  payload: {
    url,
    params,
  },
});

/**
 * Executes when successfully fetched playlist data from YouTube Data API
 *
 * @param {Playlist} data Data obtained from YouTube Data API
 * @returns FETCH_PLAYLIST_DATA_SUCCESS action object
 */
export const fetchPlaylistDataSuccessAction = (data) => ({
  type: FETCH_PLAYLIST_DATA_SUCCESS,
  payload: {
    data,
  },
});

/**
 * Executes when failed to fetch playlist data from YouTube Data API
 *
 * @returns FETCH_PLAYLIST_DATA_FAILED action object
 */
export const fetchPlaylistDataFailedAction = () => ({
  type: FETCH_PLAYLIST_DATA_FAILED,
});

/**
 * Add fetched playlist's to Redux store
 * @param {string} id Fetched playlist id
 * @returns ADD_FETCHED_PLAYLIST_ID action object
 */
export const addFetchedPlaylistIdAction = (id) => ({
  type: ADD_FETCHED_PLAYLIST_ID,
  payload: {
    id,
  },
});

/**
 * Set inputed playlist URL
 *
 * @param {string} playlistUrl
 * @return SET_PLAYLIST_URL action object for Redux
 */
export const setPlaylistUrlAction = (playlistUrl) => ({
  type: SET_PLAYLIST_URL,
  payload: {
    playlistUrl,
  },
});

/**
 * Fetching videos information asynchronously from API to Redux
 * @param {string} url Base url for HTTP request
 * @param {FetchParams} params Extra params for request
 * @returns FETCH_VIDEO_DATA action object
 */
export const fetchVideoDataAction = (url, params) => ({
  type: FETCH_VIDEO_DATA,
  payload: {
    url,
    params,
  },
});

/**
 * Executes when successfully fetched video data from YouTube Data API
 *
 * @param {Video} data Data obtained from YouTube Data API
 * @returns FETCH_VIDEO_DATA_SUCCESS action object
 */
export const fetchVideoDataSuccessAction = (data) => ({
  type: FETCH_VIDEO_DATA_SUCCESS,
  payload: {
    data,
  },
});

/**
 * Executes when failed to fetch video data from YouTube Data API
 *
 * @returns FETCH_VIDEO_DATA_FAILED action object
 */
export const fetchVideoDataFailedAction = () => ({
  type: FETCH_VIDEO_DATA_FAILED,
});

/**
 * Add fetched video id to ytapi redux store
 *
 * @param {string} id
 * @returns ADD_FETCHED_VIDEO_ID action object
 */
export const addFetchedVideoIdAction = (id) => ({
  type: ADD_FETCHED_VIDEO_ID,
  payload: {
    id,
  },
});

/**
 * Set inputed video URL
 *
 * @param {string} videoUrl
 * @return SET_VIDEO_URL action object for Redux
 */
export const setVideoUrlAction = (videoUrl) => ({
  type: SET_VIDEO_URL,
  payload: {
    videoUrl,
  },
});
