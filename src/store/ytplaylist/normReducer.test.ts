import deepFreeze from "deep-freeze";
import produce, { Draft } from "immer";
import get from "lodash/get";
import partial from "lodash/partial";

import { deleteNormPlaylistItemByIdAction } from "./normAction";
import { playlistsReducer } from "./normReducer";
import {
  NormPlaylists,
  NormPlaylistsEntities,
  NormVideos,
  NormVideosEntities,
} from "./types";
import { deletePlaylistOrVideoById, isPlaylistsEntities } from "./utils";

const basePlaylistsState: NormPlaylists = {
  entities: {
    playlistItems: {},
    playlists: {},
    snippets: {},
  },
  result: [],
};

const baseVideosState: NormVideos = {
  entities: {
    videoItems: {},
    videos: {},
    snippets: {},
  },
  result: [],
};

deepFreeze(basePlaylistsState);
deepFreeze(baseVideosState);

/**
 * **Note:** This function mutates entities
 *
 * @param entities Video entities to add states
 * @param videoId Dummy id to assign
 */
function makeVideosEntitiesState(
  entities: NormVideosEntities,
  videoId: number,
  itemsLength?: number
) {
  const itemIds = itemsLength
    ? Array.from({ length: itemsLength }, (_, idx) => idx + 1)
    : [];

  entities.videos[`videoId-${videoId}`] = {
    id: `videoId-${videoId}`,
    items: itemsLength
      ? itemIds.map((itemId) => `itemId-${videoId}-${itemId}`)
      : [`itemId-${videoId}-1`],
  };

  itemIds.forEach((itemId) => {
    entities.videoItems[`itemId-${videoId}-${itemId}`] = {
      id: `itemId-${videoId}-${itemId}`,
      kind: "youtube#video",
      etag: "randomString",
      snippet: `snippetId-${videoId}-${itemId}`,
    };

    entities.snippets[`snippetId-${videoId}-${itemId}`] = {
      categoryId: `categoryId-${videoId}-${itemId}`,
      title: `title-${videoId}-${itemId}`,
      channelId: `channelId-${videoId}-${itemId}`,
      channelTitle: `channelTitle-${videoId}-${itemId}`,
      description: `description-${videoId}-${itemId}`,
      liveBroadcastContent: `broadcast-${videoId}-${itemId}`,
      publishedAt: `published-${videoId}-${itemId}`,
      tags: [`tag-${videoId}-${itemId}`],
      thumbnails: [],
      localized: {
        title: `test-${videoId}-${itemId}`,
        description: `test-${videoId}-${itemId}`,
      },
    };
  });
}

function makePlaylistsEntitiesStates(
  entities: NormPlaylistsEntities,
  playlistId: number,
  itemsLength?: number
) {
  const itemIds = itemsLength
    ? Array.from({ length: itemsLength }, (_, idx) => idx + 1)
    : [];

  entities.playlists[`playlistId-${playlistId}`] = {
    id: `playlistId-${playlistId}`,
    items: itemsLength
      ? itemIds.map((itemId) => `itemId-${playlistId}-${itemId}`)
      : [`itemId-${playlistId}-1`],
  };

  itemIds.forEach((itemId) => {
    entities.playlistItems[`itemId-${playlistId}-${itemId}`] = {
      id: `itemId-${playlistId}-${itemId}`,
      kind: "youtube#playlistItem",
      etag: "randomString",
      snippet: `snippetId-${playlistId}-${itemId}`,
    };

    entities.snippets[`snippetId-${playlistId}-${itemId}`] = {
      playlistId: `playlistId-${playlistId}`,
      channelId: `channelId-${playlistId}-${itemId}`,
      channelTitle: `channelTitle-${playlistId}-${itemId}`,
      description: `description-${playlistId}-${itemId}`,
      position: playlistId * itemId,
      publishedAt: `published-${playlistId}-${itemId}`,
      thumbnails: {
        default: {
          height: itemId,
          width: itemId,
          url: `url-${playlistId}-${itemId}`,
        },
        medium: {
          height: itemId,
          width: itemId,
          url: `url-${playlistId}-${itemId}`,
        },
        standard: {
          height: itemId,
          width: itemId,
          url: `url-${playlistId}-${itemId}`,
        },
        high: {
          height: itemId,
          width: itemId,
          url: `url-${playlistId}-${itemId}`,
        },
        maxres: {
          height: itemId,
          width: itemId,
          url: `url-${playlistId}-${itemId}`,
        },
      },
      resourceId: {
        kind: "youtube#video",
        videoId: `videoId-${playlistId}-${itemId}`,
      },
      title: `title-${playlistId}-${itemId}`,
    };
  });
}

/**
 *
 * @param states
 * @param idxToExclude
 * @returns Mutated states
 */
function _stateMaker(
  states: NormPlaylists | NormVideos,
  customizer?: {
    sourceLength?: number;
    itemsLength?: number;
    excludeId?: number;
  }
): NormPlaylists | NormVideos {
  const sourceLength = get(customizer, "sourceLength");
  const itemsLength = get(customizer, "itemsLength");
  const excludeId = get(customizer, "excludeId");

  return produce(states, (draft) => {
    Array.from({ length: sourceLength || 10 }, (_, idx) => idx + 1).forEach(
      (val) => {
        if (excludeId && excludeId === val) return;

        const entities = draft.entities;
        const result = draft.result;

        if (isPlaylistsEntities(entities)) {
          makePlaylistsEntitiesStates(entities, val, itemsLength);
          result.push(`playlistId-${val}`);
        } else {
          makeVideosEntitiesState(entities, val, itemsLength);
          result.push(`videoId-${val}`);
        }
      }
    );
  });
}

const playlistsStatesMaker = partial(_stateMaker, basePlaylistsState);
const videosStatesMaker = partial(_stateMaker, baseVideosState);

const initialPlaylistsState = playlistsStatesMaker({
  itemsLength: 10,
});
const initialVideosState = videosStatesMaker({
  itemsLength: 10,
});

deepFreeze(initialPlaylistsState);
deepFreeze(initialVideosState);

describe("test deletePlaylistOrVideoById util functions", () => {
  test("should delete playlist by id property using deletePlaylistOrVideoById function", () => {
    const nextPlaylistsState = produce(
      initialPlaylistsState,
      (draft: Draft<NormPlaylists>) => {
        deletePlaylistOrVideoById(draft, "playlistId-1");
      }
    );

    expect(nextPlaylistsState).toEqual(
      _stateMaker(basePlaylistsState, {
        itemsLength: 10,
        excludeId: 1,
      })
    );
  });

  test("should delete video by id property using deletePlaylistOrVideoById function", () => {
    const nextVideosState = produce(
      initialVideosState,
      (draft: Draft<NormVideos>) => {
        deletePlaylistOrVideoById(draft, "videoId-10");
      }
    );

    expect(nextVideosState).toEqual(
      _stateMaker(baseVideosState, {
        itemsLength: 10,
        excludeId: 10,
      })
    );
  });

  test("deletePlaylistOrVideoById function should handle delete non-existence playlist/video", () => {
    // playlists
    const nextPlaylistsState = produce(
      initialPlaylistsState,
      (draft: Draft<NormPlaylists>) => {
        deletePlaylistOrVideoById(draft, "playlistId-11");
      }
    );

    expect(nextPlaylistsState).toEqual(
      _stateMaker(basePlaylistsState, {
        itemsLength: 10,
      })
    );

    // videos
    const nextVideosState = produce(
      initialVideosState,
      (draft: Draft<NormVideos>) => {
        deletePlaylistOrVideoById(draft, "videoId-11");
      }
    );

    expect(nextVideosState).toEqual(
      _stateMaker(baseVideosState, {
        itemsLength: 10,
      })
    );
  });
});

describe("normalized playlistsReducer", () => {
  test("should handle DELETE_NORM_PLAYLIST_ITEM_BY_ID action correctly", () => {
    const initialStates = _stateMaker(basePlaylistsState, {
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
