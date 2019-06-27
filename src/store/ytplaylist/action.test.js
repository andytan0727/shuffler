import {
  ADD_PLAYLIST,
  ADD_PLAYING_PLAYLISTS,
  ADD_VIDEO,
  ADD_PLAYING_VIDEOS,
  APPEND_LIST_TO_PLAY,
  REMOVE_PLAYING_PLAYLISTS,
  REMOVE_PLAYLISTS,
  REMOVE_FROM_LIST_TO_PLAY,
} from "../../utils/constants/actionConstants";
import {
  addPlaylistAction,
  addPlayingPlaylistsAction,
  addVideoAction,
  addPlayingVideosAction,
  appendListToPlayAction,
  removePlayingPlaylistsAction,
  removePlaylistsAction,
  removeFromListToPlayAction,
} from "./action";

describe("ytplaylist actions", () => {
  // Bypass jsdoc/ts property not found error on global
  /** @type {*} */
  const customGlobal = global;

  /** @type {Playlist} */
  const playlist = customGlobal.playlist;

  /** @type {Video} */
  const video = customGlobal.video;

  test("should create ADD_PLAYLIST action object", () => {
    expect(addPlaylistAction(playlist)).toEqual({
      type: ADD_PLAYLIST,
      payload: {
        playlist,
      },
    });
  });

  test("should create REMOVE_PLAYLISTS action object", () => {
    const playlistIds = [playlist.id];

    expect(removePlaylistsAction(playlistIds)).toEqual({
      type: REMOVE_PLAYLISTS,
      payload: {
        playlistIds,
      },
    });
  });

  test("should REMOVE_PLAYLISTS payload contains playlistIds [Array]", () => {
    const playlistIds = [playlist.id];
    const removePlaylistsActionObject = removePlaylistsAction(playlistIds);

    // ensure the playlistIds supplied is an array
    expect(Array.isArray(removePlaylistsActionObject.payload.playlistIds)).toBe(
      true
    );
  });

  test("should create ADD_PLAYING_PLAYLISTS action object", () => {
    const playlistIds = [playlist.id];

    expect(addPlayingPlaylistsAction(playlistIds)).toEqual({
      type: ADD_PLAYING_PLAYLISTS,
      payload: {
        playlistIds: [playlist.id],
      },
    });
  });

  test("should ADD_PLAYING_PLAYLISTS payload contains playlistIds [Array]", () => {
    const playlistIds = [playlist.id];
    const addPlayingPlaylistsActionObject = addPlayingPlaylistsAction(
      playlistIds
    );

    // ensure playlistIds is an array and not playlist object
    expect(
      Array.isArray(addPlayingPlaylistsActionObject.payload.playlistIds)
    ).toBe(true);
  });

  test("should create REMOVE_PLAYING_PLAYLISTS action object", () => {
    expect(removePlayingPlaylistsAction([playlist.id])).toEqual({
      type: REMOVE_PLAYING_PLAYLISTS,
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

  test("should create REMOVE_FROM_LIST_TO_PLAY action object", () => {
    const itemIds = {
      video: [video.id],
      playlist: [playlist.id],
    };

    // for playlist
    expect(removeFromListToPlayAction(itemIds.playlist, "playlist")).toEqual({
      type: REMOVE_FROM_LIST_TO_PLAY,
      payload: {
        itemIds: itemIds.playlist,
        itemType: "playlist",
      },
    });

    // for video
    expect(removeFromListToPlayAction(itemIds.video, "video")).toEqual({
      type: REMOVE_FROM_LIST_TO_PLAY,
      payload: {
        itemIds: itemIds.video,
        itemType: "video",
      },
    });
  });
});
