import {
  CLEAR_LIST_TO_PLAY,
  SHUFFLE_LIST_TO_PLAY,
} from "utils/constants/actionConstants";

import {
  clearListToPlayAction,
  shuffleListToPlayAction,
} from "./listToPlayActions";

describe("listToPlay actions", () => {
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
