import {
  ADD_PLAYING_VIDEOS,
  ADD_VIDEO,
  ADD_VIDEOS_TO_LIST_TO_PLAY,
  APPEND_LIST_TO_PLAY,
  CLEAR_LIST_TO_PLAY,
  DELETE_VIDEOS,
  REMOVE_FROM_LIST_TO_PLAY,
  REMOVE_PLAYING_VIDEOS,
  REMOVE_VIDEOS_FROM_LIST_TO_PLAY,
  SET_CHECKED_VIDEOS,
  SHUFFLE_LIST_TO_PLAY,
} from "utils/constants/actionConstants";

import {
  addPlayingVideosAction,
  addVideoAction,
  addVideosToListToPlayAction,
  appendListToPlayAction,
  deleteVideosAction,
  removeFromListToPlayAction,
  removePlayingVideosAction,
  removeVideosFromListToPlayAction,
  setCheckedVideosAction,
} from "./action";
import { clearListToPlayAction, shuffleListToPlayAction } from "./normAction";
import { Video } from "./types";

describe("ytplaylist actions", () => {
  const customGlobal: unknown = global;

  // @ts-ignore
  const video: Video = customGlobal.video;

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
    };

    // for video
    expect(removeFromListToPlayAction(itemIds.video, "videos")).toEqual({
      type: REMOVE_FROM_LIST_TO_PLAY,
      payload: {
        itemIds: itemIds.video,
        itemType: "videos",
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
