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
} from "../action";
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
} from "../../../utils/constants/actionConstants";

describe("ytapi actions", () => {
  const fetchedPlaylistItems = Array.from(
    { length: 10 },
    (_, idx) => idx + 1
  ).map((val) => ({
    id: val,
    snippet: {
      title: `video-${val}`,
      resourceId: {
        videoId: `vid-${val}`,
      },
    },
  }));
  const fetchedVideoItem = {
    etag: "random_string",
    id: "videoId",
    kind: "youtube#video",
    snippet: {
      title: `video title`,
      description: "video description",
      thumbnails: {
        default: "default size",
        medium: "medium",
        high: "high",
        standard: "standard",
        maxres: "maxres",
      },
    },
  };
  const playlist = {
    id: "playlist",
    items: fetchedPlaylistItems,
  };
  const video = {
    id: "video",
    items: fetchedVideoItem,
  };

  const url = "http://sample.test.com";
  const playlistParams = {
    part: "snippet",
    maxResults: "50",
    playlistId: "",
    fields: ["items", "nextPageToken", "pageInfo"],
  };
  const videoParams = {
    part: "snippet",
    id: "videoId",
    maxResults: "5",
    fields: ["items"],
  };

  test("should create FETCH_PLAYLIST_DATA action object", () => {
    expect(fetchPlaylistDataAction(url, playlistParams)).toEqual({
      type: FETCH_PLAYLIST_DATA,
      payload: {
        url,
        params: playlistParams,
      },
    });
  });

  test("should create FETCH_PLAYLIST_DATA_SUCCESS action object", () => {
    const data = fetchedPlaylistItems;
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
    expect(fetchVideoDataAction(url, videoParams)).toEqual({
      type: FETCH_VIDEO_DATA,
      payload: {
        url,
        params: videoParams,
      },
    });
  });

  test("should create FETCH_VIDEO_DATA_SUCCESS action object", () => {
    const data = fetchedVideoItem;
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
