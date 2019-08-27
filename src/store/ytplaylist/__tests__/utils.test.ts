import deepFreeze from "deep-freeze";
import produce, { Draft } from "immer";
import partial from "lodash/partial";
import { stateMaker } from "utils/helper/testUtils";

import { Playlists, Videos } from "../types";
import { deletePlaylistOrVideoById } from "../utils";

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
