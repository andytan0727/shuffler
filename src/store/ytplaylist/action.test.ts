import {
  ADD_PLAYLIST,
  ADD_PLAYING_PLAYLISTS,
  ADD_VIDEO,
  ADD_PLAYING_VIDEOS,
  APPEND_LIST_TO_PLAY,
  REMOVE_PLAYING_PLAYLISTS,
  DELETE_PLAYLISTS,
  REMOVE_FROM_LIST_TO_PLAY,
  RENAME_PLAYLIST,
  SHUFFLE_LIST_TO_PLAY,
  CLEAR_LIST_TO_PLAY,
  UPDATE_LIST_TO_PLAY,
  TOGGLE_PLAYING_VIDEO,
  REMOVE_VIDEOS_FROM_LIST_TO_PLAY,
  ADD_VIDEOS_TO_LIST_TO_PLAY,
  REMOVE_PLAYING_VIDEOS,
  SET_CHECKED_VIDEOS,
  DELETE_VIDEOS,
  REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY,
  ADD_PLAYLISTS_TO_LIST_TO_PLAY,
  SET_CHECKED_PLAYLISTS,
} from "../../utils/constants/actionConstants";
import {
  addPlaylistAction,
  addPlayingPlaylistsAction,
  addVideoAction,
  addPlayingVideosAction,
  appendListToPlayAction,
  removePlayingPlaylistsAction,
  deletePlaylistsAction,
  removeFromListToPlayAction,
  renamePlaylistAction,
  shuffleListToPlayAction,
  clearListToPlayAction,
  updateListToPlayAction,
  togglePlayingVideoAction,
  removeVideosFromListToPlayAction,
  addVideosToListToPlayAction,
  removePlayingVideosAction,
  setCheckedVideosAction,
  deleteVideosAction,
  removePlaylistsFromListToPlayAction,
  addPlaylistsToListToPlayAction,
  setCheckedPlaylistsAction,
} from "./action";
import { Playlist, Video } from "./types";

describe("ytplaylist actions", () => {
  const customGlobal: unknown = global;

  // @ts-ignore
  const playlist: Playlist = customGlobal.playlist;

  // @ts-ignore
  const video: Video = customGlobal.video;

  // =================================
  // Playlist
  // =================================
  test("should create ADD_PLAYLIST action object", () => {
    expect(addPlaylistAction(playlist)).toEqual({
      type: ADD_PLAYLIST,
      payload: {
        playlist,
      },
    });
  });

  test("should create DELETE_PLAYLISTS action object", () => {
    const playlistIds = [playlist.id];

    expect(deletePlaylistsAction(playlistIds)).toEqual({
      type: DELETE_PLAYLISTS,
      payload: {
        playlistIds,
      },
    });
  });

  test("should DELETE_PLAYLISTS payload contains playlistIds [Array]", () => {
    const playlistIds = [playlist.id];
    const removePlaylistsActionObject = deletePlaylistsAction(playlistIds);

    // ensure the playlistIds supplied is an array
    expect(Array.isArray(removePlaylistsActionObject.payload.playlistIds)).toBe(
      true
    );
  });

  test("should create RENAME_PLAYLIST action object", () => {
    const newName = "newName";
    const playlistIdToRename = "id-1";
    expect(renamePlaylistAction(newName, playlistIdToRename)).toEqual({
      type: RENAME_PLAYLIST,
      payload: {
        newName,
        playlistIdToRename,
      },
    });
  });

  test("should create SET_CHECKED_PLAYLISTS action object", () => {
    expect(setCheckedPlaylistsAction(["id"])).toEqual({
      type: SET_CHECKED_PLAYLISTS,
      payload: {
        checkedPlaylists: ["id"],
      },
    });
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

  test("should create ADD_PLAYLISTS_TO_LIST_TO_PLAY action object", () => {
    expect(addPlaylistsToListToPlayAction(["id"])).toEqual({
      type: ADD_PLAYLISTS_TO_LIST_TO_PLAY,
      payload: {
        playlistIds: ["id"],
      },
    });
  });

  test("should create REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY action object", () => {
    expect(removePlaylistsFromListToPlayAction(["id"])).toEqual({
      type: REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY,
      payload: {
        playlistIds: ["id"],
      },
    });
  });

  // =================================
  // Videos
  // =================================
  test("should create ADD_VIDEO action object", () => {
    expect(addVideoAction(video)).toEqual({
      type: ADD_VIDEO,
      payload: {
        videoToAdd: video,
      },
    });
  });

  test("should create DELETE_VIDEOS action object", () => {
    expect(deleteVideosAction(["id"])).toEqual({
      type: DELETE_VIDEOS,
      payload: {
        videoIds: ["id"],
      },
    });
  });

  test("should create SET_CHECKED_VIDEOS action object", () => {
    expect(setCheckedVideosAction(["id"])).toEqual({
      type: SET_CHECKED_VIDEOS,
      payload: {
        checkedVideos: ["id"],
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

  test("should create REMOVE_PLAYING_VIDEOS action object", () => {
    expect(removePlayingVideosAction(["id"])).toEqual({
      type: REMOVE_PLAYING_VIDEOS,
      payload: {
        videoIds: ["id"],
      },
    });
  });

  test("should create ADD_VIDEOS_TO_LIST_TO_PLAY action", () => {
    expect(addVideosToListToPlayAction(["id"])).toEqual({
      type: ADD_VIDEOS_TO_LIST_TO_PLAY,
      payload: {
        videoIds: ["id"],
      },
    });
  });

  test("should create REMOVE_VIDEOS_FROM_LIST_TO_PLAY action object", () => {
    expect(removeVideosFromListToPlayAction(["videoId"])).toEqual({
      type: REMOVE_VIDEOS_FROM_LIST_TO_PLAY,
      payload: {
        videoIds: ["videoId"],
      },
    });
  });

  test("should create TOGGLE_PLAYING_VIDEO action object", () => {
    expect(togglePlayingVideoAction("videoId")).toEqual({
      type: TOGGLE_PLAYING_VIDEO,
      payload: {
        videoId: "videoId",
      },
    });
  });

  // =================================
  // List To Play
  // =================================
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
    expect(removeFromListToPlayAction(itemIds.playlist, "playlists")).toEqual({
      type: REMOVE_FROM_LIST_TO_PLAY,
      payload: {
        itemIds: itemIds.playlist,
        itemType: "playlists",
      },
    });

    // for video
    expect(removeFromListToPlayAction(itemIds.video, "videos")).toEqual({
      type: REMOVE_FROM_LIST_TO_PLAY,
      payload: {
        itemIds: itemIds.video,
        itemType: "videos",
      },
    });
  });

  test("should create UPDATE_LIST_TO_PLAY action object", () => {
    expect(updateListToPlayAction(playlist.items)).toEqual({
      type: UPDATE_LIST_TO_PLAY,
      payload: {
        listToPlay: playlist.items,
      },
    });
  });

  test("should create CLEAR_LIST_TO_PLAY action object", () => {
    expect(clearListToPlayAction()).toEqual({
      type: CLEAR_LIST_TO_PLAY,
    });
  });

  test("should create SHUFFLE_LIST_TO_PLAY action object", () => {
    expect(shuffleListToPlayAction()).toEqual({
      type: SHUFFLE_LIST_TO_PLAY,
    });
  });
});
