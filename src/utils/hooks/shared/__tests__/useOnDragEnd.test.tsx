import { Store } from "redux";
import { reorderListToPlayItemAction } from "store/ytplaylist/listToPlayActions";
import {
  getDropResult,
  renderHookWithReduxStore,
} from "utils/helper/dragHooksTestHelper";
import { generateMockStore } from "utils/helper/mockStore";

import { act, HookResult } from "@testing-library/react-hooks";

import { useOnDragEnd } from "../useOnDragEnd";

describe("useOnDragEnd hook", () => {
  // one of the reorder actions
  const reorderAction = reorderListToPlayItemAction;

  let items: string[];
  let store: Store;
  let oriItemCount: number;
  let curItemCount: number;
  let result: HookResult<ReturnType<typeof useOnDragEnd>>;

  beforeEach(() => {
    items = ["l1", "l2", "l3", "l4"];
    store = generateMockStore({
      ytplaylist: {
        listToPlay: {
          result: items,
        },
      },
    });
    oriItemCount = items.length;
    curItemCount = oriItemCount;
    result = renderHookWithReduxStore(
      () => useOnDragEnd(oriItemCount, reorderAction),
      store
    ).result;
  });

  test("hook returns handleOnDragEnd closure function", () => {
    const { handleOnDragEnd } = result.current;

    expect(typeof handleOnDragEnd).toBe("function");
    expect(typeof handleOnDragEnd(oriItemCount)).toBe("function");
  });

  test("should not reorder items if fromIdx === toIdx", () => {
    const { handleOnDragEnd } = result.current;
    const fromIdx = 0;
    const toIdx = 0;
    const dropResult = getDropResult(fromIdx, toIdx);

    expect(store.getState().ytplaylist.listToPlay.result).toEqual(items);

    act(() => {
      handleOnDragEnd(curItemCount)(dropResult);
    });

    // items remained unchanged
    expect(store.getState().ytplaylist.listToPlay.result).toEqual(items);
  });

  test("should not reorder items when filtering", () => {
    curItemCount -= 1; // decrease curItemCount to mock filtering

    const fromIdx = 0;
    const toIdx = 2;

    const dropResult = getDropResult(fromIdx, toIdx);

    expect(store.getState().ytplaylist.listToPlay.result).toEqual(items);

    // fire mock drag event
    act(() => {
      result.current.handleOnDragEnd(curItemCount)(dropResult);
    });

    // Order of listToPlayResult remained unchanged
    expect(store.getState().ytplaylist.listToPlay.result).toEqual(items);
  });
});
