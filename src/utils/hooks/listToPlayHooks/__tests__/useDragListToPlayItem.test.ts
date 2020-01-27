import { Store } from "redux";
import {
  getDropResult,
  renderHookWithReduxStore,
} from "utils/helper/dragHooksTestHelper";
import { generateMockStore } from "utils/helper/mockStore";

import { act } from "@testing-library/react";

import { useDragListToPlayItem } from "../useDragListToPlayItem";

describe("useDragListToPlayItem hook", () => {
  let store: Store;
  let oriItemCount: number;
  let curItemCount: number;
  let listToPlayResult: string[];

  beforeEach(() => {
    listToPlayResult = ["l1", "l2", "l3", "l4"];
    store = generateMockStore({
      ytplaylist: {
        listToPlay: {
          result: listToPlayResult,
        },
      },
    });

    oriItemCount = listToPlayResult.length;
    curItemCount = oriItemCount;
  });

  test("should have reordered item from index 0 to 2", () => {
    const { result } = renderHookWithReduxStore(
      () => useDragListToPlayItem(),
      store
    );
    const fromIdx = 0;
    const toIdx = 2;

    const dropResult = getDropResult(fromIdx, toIdx);

    expect(store.getState().ytplaylist.listToPlay.result).toEqual(
      listToPlayResult
    );

    // fire mock drag event
    act(() => {
      result.current.handleOnDragEnd(curItemCount)(dropResult);
    });

    expect(store.getState().ytplaylist.listToPlay.result).toEqual([
      "l2", // <- from 0
      "l3",
      "l1", // <- to 2
      "l4",
    ]);
  });
});
