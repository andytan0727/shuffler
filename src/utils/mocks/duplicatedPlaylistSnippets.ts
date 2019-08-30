import { Playlists } from "store/ytplaylist/types";

const playlistId1 = "playlistId-1";
const playlistId2 = "playlistId-2";
const itemIds1 = ["itemId-1", "itemId-2"];
const itemIds2 = ["itemId-3", "itemId-4"];
const kind = "youtube#playlistItems";

const playlistsWithDuplicatedSnippets: Playlists = {
  updating: false,
  entities: {
    playlists: {
      [playlistId1]: {
        id: playlistId1,
        items: itemIds1,
      },
      [playlistId2]: {
        id: playlistId2,
        items: itemIds2,
      },
    },
    playlistItems: {
      // first playlist - playlistId1
      [itemIds1[0]]: {
        id: itemIds1[0],
        kind,
        snippet: "snippetId-1",
      },
      [itemIds1[1]]: {
        id: itemIds1[1],
        kind,
        snippet: "snippetId-2",
      },

      // second playlist - playlistId2
      [itemIds2[0]]: {
        id: itemIds1[0],
        kind,
        snippet: "snippetId-3",
      },
      [itemIds2[1]]: {
        id: itemIds1[1],
        kind,

        // NOTE: duplicated snippet with itemIds1[0]
        snippet: "snippetId-1",
      },
    },
    snippets: {
      // the duplicated snippet
      "snippetId-1": {
        playlistId: playlistId1,
        title: "snippet-1",
        resourceId: {
          kind: "video",
          videoId: "videoId-1",
        },
      },
      "snippetId-2": {
        playlistId: playlistId1,
        title: "snippet-2",
        resourceId: {
          kind: "video",
          videoId: "videoId-2",
        },
      },
      "snippetId-3": {
        playlistId: playlistId2,
        title: "snippet-3",
        resourceId: {
          kind: "video",
          videoId: "videoId-3",
        },
      },
    },
  },
  result: [playlistId1, playlistId2],
};

export default playlistsWithDuplicatedSnippets;
