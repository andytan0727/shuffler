import deepFreeze from "deep-freeze";
import produce, { Draft } from "immer";
import partial from "lodash/partial";
import { stateMaker } from "utils/helper/testUtils";
import playlistsWithDuplicatedSnippets from "utils/mocks/duplicatedPlaylistSnippets";

import { Playlists, Videos } from "../types";
import { deletePlaylistOrVideoById, isSnippetDuplicated } from "../utils";

const basePlaylistsState: Playlists = {
  updating: false,
  entities: {
    playlistItems: {},
    playlists: {},
    snippets: {},
  },
  result: [],
};

const baseVideosState: Videos = {
  entities: {
    videoItems: {},
    videos: {},
    snippets: {},
  },
  result: [],
};

deepFreeze(basePlaylistsState);
deepFreeze(baseVideosState);

const playlistsStatesMaker = partial(stateMaker, basePlaylistsState);
const videosStatesMaker = partial(stateMaker, baseVideosState);

const initialPlaylistsState = playlistsStatesMaker({
  itemsLength: 10,
});
const initialVideosState = videosStatesMaker({
  itemsLength: 10,
});

describe("Test deletePlaylistOrVideoById util functions", () => {
  test("should delete playlist by id property using deletePlaylistOrVideoById function", () => {
    const nextPlaylistsState = produce(
      initialPlaylistsState,
      (draft: Draft<Playlists>) => {
        deletePlaylistOrVideoById(draft, "playlistId-1");
      }
    );

    expect(nextPlaylistsState).toEqual(
      stateMaker(basePlaylistsState, {
        itemsLength: 10,
        excludeId: 1,
      })
    );
  });

  test("should delete video by id property using deletePlaylistOrVideoById function", () => {
    const nextVideosState = produce(
      initialVideosState,
      (draft: Draft<Videos>) => {
        deletePlaylistOrVideoById(draft, "videoId-10");
      }
    );

    expect(nextVideosState).toEqual(
      stateMaker(baseVideosState, {
        itemsLength: 10,
        excludeId: 10,
      })
    );
  });

  test("deletePlaylistOrVideoById function should handle delete non-existence playlist/video", () => {
    const nextPlaylistsState = produce(
      initialPlaylistsState,
      (draft: Draft<Playlists>) => {
        deletePlaylistOrVideoById(draft, "playlistId-11");
      }
    );

    expect(nextPlaylistsState).toEqual(
      stateMaker(basePlaylistsState, {
        itemsLength: 10,
      })
    );

    // videos
    const nextVideosState = produce(
      initialVideosState,
      (draft: Draft<Videos>) => {
        deletePlaylistOrVideoById(draft, "videoId-11");
      }
    );

    expect(nextVideosState).toEqual(
      stateMaker(baseVideosState, {
        itemsLength: 10,
      })
    );
  });
});

describe("testing isSnippetDuplicated function", () => {
  test("should return true if snippets are duplicated", () => {
    // snippetId-1 is duplicated in the mocked playlists
    expect(
      isSnippetDuplicated(
        playlistsWithDuplicatedSnippets.entities,
        "snippetId-1"
      )
    ).toBeTruthy();
  });

  test("should return false if snippets are not duplicated", () => {
    const deletedPlaylist2 = produce(
      playlistsWithDuplicatedSnippets,
      (draft) => {
        const playlistId = "playlistId-2";
        const itemIds = draft.entities.playlists[playlistId].items;
        delete draft.entities.playlists[playlistId];

        itemIds.forEach(
          (itemId) => delete draft.entities.playlistItems[itemId]
        );
      }
    );

    // then delete playlist1's item1 also to prevent false positive result
    // because isSnippetDuplicated checks for playlistItems first
    const deletedPlaylist1Item1 = produce(deletedPlaylist2, (draft) => {
      const playlistId = "playlistId-1";
      const itemId1 = draft.entities.playlists[playlistId].items[0];

      delete draft.entities.playlistItems[itemId1];
    });

    // assuming snippetId-4 is from DELETED playlistItem
    expect(
      isSnippetDuplicated(deletedPlaylist1Item1.entities, "snippetId-1")
    ).toBeFalsy();
  });
});
