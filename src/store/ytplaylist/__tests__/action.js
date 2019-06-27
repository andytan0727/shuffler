import {
  ADD_PLAYLIST,
  ADD_PLAYING_PLAYLISTS,
  ADD_VIDEO,
  ADD_PLAYING_VIDEOS,
  APPEND_LIST_TO_PLAY,
} from "../../../utils/constants/actionConstants";
import {
  addPlaylistAction,
  addPlayingPlaylistsAction,
  addVideoAction,
  addPlayingVideosAction,
  appendListToPlayAction,
} from "../action";

describe("ytplaylist actions", () => {
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
    id: "playlistId",
    items: fetchedPlaylistItems,
  };
  const video = {
    id: "videoId",
    items: fetchedVideoItem,
  };

  test("should create ADD_PLAYLIST action object", () => {
    expect(addPlaylistAction(playlist)).toEqual({
      type: ADD_PLAYLIST,
      payload: {
        playlist,
      },
    });
  });

  test("should create ADD_PLAYING_PLAYLISTS action object", () => {
    expect(addPlayingPlaylistsAction([playlist.id])).toEqual({
      type: ADD_PLAYING_PLAYLISTS,
      payload: {
        playlistIds: [playlist.id],
      },
    });
  });

  // ========================
  // Videos
  // ========================

  test("should create ADD_VIDEO action object", () => {
    expect(addVideoAction(video)).toEqual({
      type: ADD_VIDEO,
      payload: {
        videoToAdd: video,
      },
    });
  });

  test("should create ADD_PLAYING_VIDEOS action object", () => {
    expect(addPlayingVideosAction([video.id])).toEqual({
      type: ADD_PLAYING_VIDEOS,
      payload: {
        videoIds: [video.id],
      },
    });
  });

  test("should create APPEND_LIST_TO_PLAY action object", () => {
    const items = video.items;
    expect(appendListToPlayAction(items)).toEqual({
      type: APPEND_LIST_TO_PLAY,
      payload: {
        items,
      },
    });
  });
});
