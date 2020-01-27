import { Store } from "redux";
import {
  getDropResult,
  renderHookWithReduxStore,
} from "utils/helper/dragHooksTestHelper";
import { generateMockStore } from "utils/helper/mockStore";

import { act } from "@testing-library/react";

import { useDragVideoItem } from "../useDragVideoItem";

describe("useDragVideoItem hook", () => {
  let store: Store;
  let oriItemCount: number;
  let curItemCount: number;
  let videoItems: string[];

  beforeEach(() => {
    videoItems = ["v1", "v2", "v3", "v4"];
    store = generateMockStore({
      ytplaylist: {
        videos: {
          result: videoItems,
        },
      },
    });

    oriItemCount = videoItems.length;
    curItemCount = oriItemCount;
  });

  test("should have reordered items from index 0 to 2", () => {
    const { result } = renderHookWithReduxStore(
      () => useDragVideoItem(),
      store
    );
    const fromIdx = 0;
    const toIdx = 2;

    const dropResult = getDropResult(fromIdx, toIdx);

    expect(store.getState().ytplaylist.videos.result).toEqual(videoItems);

    // fire mock drag event
    act(() => {
      result.current.handleOnDragEnd(curItemCount)(dropResult);
    });

    expect(store.getState().ytplaylist.videos.result).toEqual([
      "v2", // <- from 0
      "v3",
      "v1", // <- to 2
      "v4",
    ]);
  });
});
