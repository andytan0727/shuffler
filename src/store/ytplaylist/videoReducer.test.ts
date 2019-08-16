import deepFreeze from "deep-freeze";
import partial from "lodash/partial";

import { stateMaker } from "./testUtils";
import { NormVideos } from "./types";

const baseVideosState: NormVideos = {
  entities: {
    videoItems: {},
    videos: {},
    snippets: {},
  },
  result: [],
};

deepFreeze(baseVideosState);

const videosStatesMaker = partial(stateMaker, baseVideosState);

const initialVideosState = videosStatesMaker({
  itemsLength: 10,
});

deepFreeze(initialVideosState);

describe("Test videoReducer", () => {
  test("should successfully run", () => {
    expect(1).toEqual(1);
  });
});
