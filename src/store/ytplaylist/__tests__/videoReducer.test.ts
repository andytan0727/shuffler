import deepFreeze from "deep-freeze";
import partial from "lodash/partial";

import { stateMaker } from "../testUtils";
import { Videos } from "../types";

const baseVideosState: Videos = {
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
