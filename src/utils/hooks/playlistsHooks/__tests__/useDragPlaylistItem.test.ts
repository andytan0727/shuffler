import { Store } from "redux";
import {
  getDropResult,
  renderHookWithReduxStore,
} from "utils/helper/dragHooksTestHelper";
import { generateMockStore } from "utils/helper/mockStore";

import { act } from "@testing-library/react";

import { useDragPlaylistItem } from "../useDragPlaylistItem";

const playlistId = "playlistId-1";

describe("useDragPlaylistItem hook", () => {
  let store: Store;
  let oriItemCount: number;
  let curItemCount: number;
  let playlistItems: string[];

  beforeEach(() => {
    playlistItems = ["p1", "p2", "p3", "p4"];
    store = generateMockStore({
      ytplaylist: {
        playlists: {
          entities: {
            playlists: {
              [playlistId]: {
                items: playlistItems,
              },
            },
          },
          result: [playlistId],
        },
      },
    });

    oriItemCount = playlistItems.length;
    curItemCount = oriItemCount;
  });

  test("should have reordered item from index 0 to 2", () => {
    const { result } = renderHookWithReduxStore(
      () => useDragPlaylistItem(playlistId),
      store
    );
    const fromIdx = 0;
    const toIdx = 2;

    const dropResult = getDropResult(fromIdx, toIdx);

    expect(
      store.getState().ytplaylist.playlists.entities.playlists[playlistId].items
    ).toEqual(playlistItems);

    // fire mock drag event
    act(() => {
      result.current.handleOnDragEnd(curItemCount)(dropResult);
    });

    expect(
      store.getState().ytplaylist.playlists.entities.playlists[playlistId].items
    ).toEqual([
      "p2", // <- from 0
      "p3",
      "p1", // <- to 2
      "p4",
    ]);
  });
});
