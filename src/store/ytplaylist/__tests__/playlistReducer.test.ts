import deepFreeze from "deep-freeze";
import partial from "lodash/partial";
import { stateMaker } from "utils/helper/testUtils";

import {
  deletePlaylistItemByIdAction,
  deletePlaylistItemsByIdAction,
} from "../playlistActions";
import { playlistsReducer } from "../playlistReducer";
import { Playlists } from "../types";

const basePlaylistsState: Playlists = {
  updating: false,
  entities: {
    playlistItems: {},
    playlists: {},
    snippets: {},
  },
  result: [],
};

deepFreeze(basePlaylistsState);

const playlistsStatesMaker = partial(stateMaker, basePlaylistsState);

const initialPlaylistsState = playlistsStatesMaker({
  itemsLength: 10,
});

deepFreeze(initialPlaylistsState);

describe("Test playlistsReducer", () => {
  test("should handle DELETE_PLAYLIST_ITEM_BY_ID action correctly", () => {
    const initialStates = stateMaker(basePlaylistsState, {
      itemsLength: 2,
      sourceLength: 1,
    }) as Playlists;
    const playlistId = "playlistId-1";
    const itemIdToDelete = "itemId-1-1";
    const snippetIdToDelete = "snippetId-1-1";

    // ensure itemId and snippetId exists
    expect(Object.keys(initialStates.entities.playlistItems)).toEqual(
      expect.arrayContaining([itemIdToDelete])
    );
    expect(Object.keys(initialStates.entities.snippets)).toEqual(
      expect.arrayContaining([snippetIdToDelete])
    );

    const newStates = playlistsReducer(
      initialStates,
      deletePlaylistItemByIdAction(playlistId, itemIdToDelete)
    );

    expect(newStates).toEqual({
      ...initialStates,
      entities: {
        playlistItems: {
          ...initialStates.entities.playlistItems,
          [itemIdToDelete]: undefined,
        },
        playlists: {
          ...initialStates.entities.playlists,
          [playlistId]: {
            ...initialStates.entities.playlists[playlistId],
            items: initialStates.entities.playlists[playlistId].items.filter(
              (id) => id !== itemIdToDelete
            ),
          },
        },
        snippets: {
          ...initialStates.entities.snippets,
          [snippetIdToDelete]: undefined,
        },
      },
    });
  });

  test("should handle DELETE_PLAYLIST_ITEMS_BY_ID action correctly", () => {
    const initialStates = stateMaker(basePlaylistsState, {
      itemsLength: 5,
      sourceLength: 1,
    }) as Playlists;
    const itemIdsToDelete = ["itemId-1-1", "itemId-1-2", "itemId-1-3"];
    const snippetIdsToDelete = [
      "snippetId-1-1",
      "snippetId-1-2",
      "snippetId-1-3",
    ];

    // ensure itemIds (and snippetIds) to be deleted exists
    expect(Object.keys(initialStates.entities.playlistItems)).toEqual(
      expect.arrayContaining(itemIdsToDelete)
    );
    expect(Object.keys(initialStates.entities.snippets)).toEqual(
      expect.arrayContaining(snippetIdsToDelete)
    );

    // delete items now
    const newStates = playlistsReducer(
      initialStates,
      deletePlaylistItemsByIdAction("playlistId-1", itemIdsToDelete)
    );

    // expect 3 playlist items and snippets are deleted
    // and the corresponding itemIds are removed from
    // playlist's items array
    expect(newStates).toEqual({
      ...initialStates,
      entities: {
        playlistItems: {
          ...initialStates.entities.playlistItems,
          [itemIdsToDelete[0]]: undefined,
          [itemIdsToDelete[1]]: undefined,
          [itemIdsToDelete[2]]: undefined,
        },
        playlists: {
          ...initialStates.entities.playlists,
          "playlistId-1": {
            ...initialStates.entities.playlists["playlistId-1"],
            items: initialStates.entities.playlists[
              "playlistId-1"
            ].items.filter((id) => !itemIdsToDelete.includes(id)),
          },
        },
        snippets: {
          ...initialStates.entities.snippets,
          [snippetIdsToDelete[0]]: undefined,
          [snippetIdsToDelete[1]]: undefined,
          [snippetIdsToDelete[2]]: undefined,
        },
      },
    });
  });
});
