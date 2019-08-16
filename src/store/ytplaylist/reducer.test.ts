import deepFreeze from "deep-freeze";

import { appendListToPlayAction } from "./action";
import { ytplaylist as ytplaylistReducer } from "./reducer";
import { Video, YTPlaylistState } from "./types";

describe("ytplaylist reducer", () => {
  const initialState: YTPlaylistState = {
    checkedVideos: [],
    videos: [],
    listToPlay: [],
    playingVideos: [],
  };

  deepFreeze(initialState);

  const customGlobal: unknown = global;

  // @ts-ignore
  const video: Video = customGlobal.video;

  test("should return initial state on default", () => {
    expect(
      ytplaylistReducer(
        undefined,

        // @ts-ignore
        {}
      )
    ).toEqual(initialState);
  });

  // ========================================
  // List To Play
  // ========================================
  test("should handle APPEND_LIST_TO_PLAY: add video item to listToPlay", () => {
    expect(
      ytplaylistReducer(
        initialState,

        // @ts-ignore
        appendListToPlayAction(video.items)
      )
    ).toEqual({
      ...initialState,
      listToPlay: [...video.items],
    });
  });

  test("should handle APPEND_LIST_TO_PLAY: add duplicated video items", () => {
    expect(
      ytplaylistReducer(
        { ...initialState, listToPlay: [...video.items] },

        // @ts-ignore
        appendListToPlayAction(video.items)
      )
    ).toEqual({
      ...initialState,
      listToPlay: [...video.items],
    });
  });
});
