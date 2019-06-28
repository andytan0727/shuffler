import deepFreeze from "deep-freeze";
import { setCurSongIdx, setVideoPlaying } from "./action";
import { ytplayer as ytplayerReducer } from "./reducer";

describe("ytplayer reducer", () => {
  /** @type {PlayerState} */
  const initialState = {
    playing: false,
    repeat: false,
    curSongIdx: 0,
    playerVars: {
      autoplay: 1,
      controls: 1,
      fs: 1,
      rel: 0,
      modestbranding: 1,
      loop: 0,
      iv_load_policy: 3,
    },
  };

  deepFreeze(initialState);

  test("should return initial state on default", () => {
    expect(
      ytplayerReducer(
        undefined,

        // @ts-ignore
        {}
      )
    ).toEqual(initialState);
  });

  test("should handle SET_CURRENT_SONG_IDX", () => {
    expect(
      ytplayerReducer(
        initialState,

        // @ts-ignore
        setCurSongIdx(1)
      )
    ).toEqual({
      ...initialState,
      curSongIdx: 1,
    });
  });

  test("should handle SET_VIDEO_PLAYING", () => {
    expect(
      ytplayerReducer(
        initialState,

        // @ts-ignore
        setVideoPlaying(true)
      )
    ).toEqual({
      ...initialState,
      playing: true,
    });
  });
});
