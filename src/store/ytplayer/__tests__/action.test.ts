import {
  SET_CURRENT_SONG_IDX,
  SET_VIDEO_PLAYING,
  TOGGLE_REPEAT,
} from "utils/constants/actionConstants";

import { setCurSongIdx, setVideoPlaying, toggleRepeat } from "../action";

describe("ytplayer actions", () => {
  test("should create SET_CURRENT_SONG_IDX action object", () => {
    expect(setCurSongIdx(1)).toEqual({
      type: SET_CURRENT_SONG_IDX,
      payload: {
        songIdx: 1,
      },
    });
  });

  test("should create SET_VIDEO_PLAYING action object", () => {
    expect(setVideoPlaying(true)).toEqual({
      type: SET_VIDEO_PLAYING,
      payload: {
        playing: true,
      },
    });
  });

  test("should create TOGGLE_REPEAT action object", () => {
    expect(toggleRepeat()).toEqual({
      type: TOGGLE_REPEAT,
    });
  });
});
