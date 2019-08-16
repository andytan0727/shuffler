import deepFreeze from "deep-freeze";

import { ytplaylist as ytplaylistReducer } from "./reducer";
import { YTPlaylistState } from "./types";

describe("ytplaylist reducer", () => {
  const initialState: YTPlaylistState = {
    listToPlay: [],
  };

  deepFreeze(initialState);

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
  test("should handle APPEND_LIST_TO_PLAY: add video item to listToPlay", () => {});

  test("should handle APPEND_LIST_TO_PLAY: add duplicated video items", () => {});
});
