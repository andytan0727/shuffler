import {
  addFetchedVideoIdAction,
  fetchPlaylistDataAction,
  fetchPlaylistDataSuccessAction,
  fetchPlaylistDataFailedAction,
  fetchVideoDataAction,
  fetchVideoDataSuccessAction,
  fetchVideoDataFailedAction,
  addFetchedPlaylistIdAction,
  setVideoUrlAction,
  setPlaylistUrlAction,
} from "./action";
import {
  ADD_FETCHED_VIDEO_ID,
  FETCH_PLAYLIST_DATA,
  FETCH_PLAYLIST_DATA_SUCCESS,
  FETCH_PLAYLIST_DATA_FAILED,
  FETCH_VIDEO_DATA_SUCCESS,
  FETCH_VIDEO_DATA_FAILED,
  FETCH_VIDEO_DATA,
  ADD_FETCHED_PLAYLIST_ID,
  SET_VIDEO_URL,
  SET_PLAYLIST_URL,
} from "../../utils/constants/actionConstants";

describe("ytapi actions", () => {
  /** @type {*} */
  const customGlobal = global;

  /** @type {Playlist} */
  const playlist = customGlobal.playlist;

  /** @type {Video} */
  const video = customGlobal.video;

  /** @type {string} */
  const url = customGlobal.url;

  /** @type {BaseFetchParams & PlaylistParams} */
  const playlistParams = customGlobal.playlistParams;

  /** @type {BaseFetchParams & VideoParams} */
  const videoParams = customGlobal.videoParams;

  const fetchParams = { ...playlistParams, ...videoParams };

  test("should create FETCH_PLAYLIST_DATA action object", () => {
    expect(fetchPlaylistDataAction(url, fetchParams)).toEqual({
      type: FETCH_PLAYLIST_DATA,
      payload: {
        url,
        params: fetchParams,
      },
    });
  });

  test("should create FETCH_PLAYLIST_DATA_SUCCESS action object", () => {
    const data = playlist;
    expect(fetchPlaylistDataSuccessAction(data)).toEqual({
      type: FETCH_PLAYLIST_DATA_SUCCESS,
      payload: {
        data,
      },
    });
  });

  test("should create FETCH_PLAYLIST_DATA_FAILED action object", () => {
    expect(fetchPlaylistDataFailedAction()).toEqual({
      type: FETCH_PLAYLIST_DATA_FAILED,
    });
  });

  test("should create ADD_FETCHED_PLAYLIST_ID action object", () => {
    const id = playlist.id;
    expect(addFetchedPlaylistIdAction(id)).toEqual({
      type: ADD_FETCHED_PLAYLIST_ID,
      payload: {
        id,
      },
    });
  });

  test("should create SET_PLAYLIST_URL action object", () => {
    expect(setPlaylistUrlAction("")).toEqual({
      type: SET_PLAYLIST_URL,
      payload: {
        playlistUrl: "",
      },
    });
  });

  // ========================
  // Videos
  // ========================

  test("should create FETCH_VIDEO_DATA action object", () => {
    expect(fetchVideoDataAction(url, fetchParams)).toEqual({
      type: FETCH_VIDEO_DATA,
      payload: {
        url,
        params: fetchParams,
      },
    });
  });

  test("should create FETCH_VIDEO_DATA_SUCCESS action object", () => {
    const data = video;
    expect(fetchVideoDataSuccessAction(data)).toEqual({
      type: FETCH_VIDEO_DATA_SUCCESS,
      payload: {
        data,
      },
    });
  });

  test("should create FETCH_VIDEO_DATA_FAILED action object", () => {
    expect(fetchVideoDataFailedAction()).toEqual({
      type: FETCH_VIDEO_DATA_FAILED,
    });
  });

  test("should create ADD_FETCHED_VIDEO_ID action object", () => {
    const id = video.id;
    expect(addFetchedVideoIdAction(id)).toEqual({
      type: ADD_FETCHED_VIDEO_ID,
      payload: {
        id,
      },
    });
  });

  test("should create SET_VIDEO_URL action object", () => {
    expect(setVideoUrlAction("")).toEqual({
      type: SET_VIDEO_URL,
      payload: {
        videoUrl: "",
      },
    });
  });
});
