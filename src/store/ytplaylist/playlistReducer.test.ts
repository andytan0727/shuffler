import deepFreeze from "deep-freeze";
import partial from "lodash/partial";

import { deleteNormPlaylistItemByIdAction } from "./playlistActions";
import { playlistsReducer } from "./playlistReducer";
import { stateMaker } from "./testUtils";
import { NormPlaylists } from "./types";

const basePlaylistsState: NormPlaylists = {
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
  test("should handle DELETE_NORM_PLAYLIST_ITEM_BY_ID action correctly", () => {
    const initialStates = stateMaker(basePlaylistsState, {
      itemsLength: 2,
      sourceLength: 1,
    }) as NormPlaylists;

    const newStates = playlistsReducer(
      initialStates,
      deleteNormPlaylistItemByIdAction("playlistId-1", "itemId-1-1")
    );

    expect(newStates).toEqual({
      ...initialStates,
      entities: {
        playlistItems: {
          ...initialStates.entities.playlistItems,
          "itemId-1-1": undefined,
        },
        playlists: {
          ...initialStates.entities.playlists,
          "playlistId-1": {
            ...initialStates.entities.playlists["playlistId-1"],
            items: initialStates.entities.playlists[
              "playlistId-1"
            ].items.filter((id) => id !== "itemId-1-1"),
          },
        },
        snippets: {
          ...initialStates.entities.snippets,
          "snippetId-1-1": undefined,
        },
      },
    });
  });
});
