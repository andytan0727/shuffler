import deepFreeze from "deep-freeze";

import {
  addPlayingPlaylistsAction,
  addPlaylistAction,
  appendListToPlayAction,
  deletePlaylistsAction,
  removeFromListToPlayAction,
  renamePlaylistAction,
  setCheckedPlaylistsAction,
  updateListToPlayAction,
} from "./action";
import { ytplaylist as ytplaylistReducer } from "./reducer";
import { clearListToPlayAction } from "./sharedAction";
import { Playlist, Video, YTPlaylistState } from "./types";

describe("ytplaylist reducer", () => {
  const initialState: YTPlaylistState = {
    checkedPlaylists: [],
    checkedVideos: [],
    playlists: [],
    videos: [],
    listToPlay: [],
    playingPlaylists: [],
    playingVideos: [],
  };

  deepFreeze(initialState);

  const randomIds = Array.from({ length: 2 }, () =>
    Math.floor(Math.random() * Math.floor(100)).toString()
  );

  const customGlobal: unknown = global;

  // @ts-ignore
  const playlist: Playlist = customGlobal.playlist;
  // @ts-ignore
  const video: Video = customGlobal.video;

  test("should return initial state on default", () => {
    expect(
      ytplaylistReducer(
        undefined,

        // @ts-ignore
        {}
      )
    ).toEqual(initialState);
  });

  test("should handle ADD_PLAYLIST action with new playlist", () => {
    expect(
      ytplaylistReducer(
        initialState,

        // @ts-ignore
        addPlaylistAction(playlist)
      )
    ).toEqual({
      ...initialState,
      playlists: [...initialState.playlists, playlist],
    });
  });

  test("should handle ADD_PLAYLIST action with existing playlist", () => {
    const newState = {
      ...initialState,
      playlists: [...initialState.playlists, playlist],
    };

    expect(
      ytplaylistReducer(
        newState,

        // @ts-ignore
        addPlaylistAction(playlist)
      )
    ).toEqual(newState);
  });

  test("should handle DELETE_PLAYLISTS action with one playlist id and playlist exists", () => {
    /** @type {PlaylistState} */
    const stateWithOnePlaylist = {
      ...initialState,
      playlists: [playlist],
    };

    expect(
      ytplaylistReducer(
        stateWithOnePlaylist,

        // @ts-ignore
        deletePlaylistsAction([playlist.id])
      )
    ).toEqual({
      ...initialState,
    });
  });

  test("should handle DELETE_PLAYLISTS action with MORE THAN ONE playlist id and playlists exists", () => {
    const stateWithPlaylists = {
      ...initialState,
      playlists: randomIds.map((id) => ({
        ...playlist,
        id,
      })),
    };

    expect(
      ytplaylistReducer(
        stateWithPlaylists,

        // @ts-ignore
        deletePlaylistsAction(randomIds)
      )
    ).toEqual(initialState);
  });

  test("should not throw error when handle DELETE_PLAYLISTS action with no playlist id (empty playlistIds array)", () => {
    expect(
      ytplaylistReducer(
        initialState,

        // @ts-ignore
        deletePlaylistsAction([])
      )
    ).toEqual(initialState);
  });

  test("should handle RENAME_PLAYLIST that rename one playlist", () => {
    const newName = "playlist-renamed";
    const id = "playlistId";
    const stateWithPlaylist = {
      ...initialState,
      playlists: [playlist],
    };
    expect(
      ytplaylistReducer(
        stateWithPlaylist,

        // @ts-ignore
        renamePlaylistAction(newName, id)
      )
    ).toEqual({
      ...initialState,
      playlists: [
        {
          ...playlist,
          name: newName,
        },
      ],
    });
  });

  test("should handle SET_CHECKED_PLAYLISTS that clears all checkedPlaylists", () => {
    const stateWithCheckedPlaylists = {
      ...initialState,
      checkedPlaylists: randomIds,
    };

    expect(
      ytplaylistReducer(
        stateWithCheckedPlaylists,

        // @ts-ignore
        setCheckedPlaylistsAction([])
      )
    ).toEqual({
      ...initialState,
      checkedPlaylists: [],
    });
  });

  test("should handle SET_CHECKED_PLAYLISTS that clears one of the checkedPlaylists", () => {
    const stateWithCheckedPlaylists = {
      ...initialState,
      checkedPlaylists: randomIds,
    };

    expect(
      ytplaylistReducer(
        stateWithCheckedPlaylists,

        // @ts-ignore
        setCheckedPlaylistsAction([randomIds[1]])
      )
    ).toEqual({
      ...initialState,
      checkedPlaylists: [randomIds[1]], // cleared first, left second id
    });
  });

  test("should handle SET_CHECKED_PLAYLISTS that clears checkedVideos if checkedVideos.length !== 0", () => {
    const stateWithCheckedVideos = {
      ...initialState,
      checkedVideos: randomIds,
    };

    expect(
      ytplaylistReducer(
        stateWithCheckedVideos,

        // @ts-ignore
        setCheckedPlaylistsAction([])
      )
    ).toEqual({
      ...initialState,
      checkedVideos: [], // should clear dirty checkedVideos under any circumstances
      checkedPlaylists: [],
    });
  });

  test("should handle ADD_PLAYING_PLAYLISTS with no item initially", () => {
    expect(
      ytplaylistReducer(
        initialState,

        // @ts-ignore
        addPlayingPlaylistsAction(randomIds)
      )
    ).toEqual({
      ...initialState,
      playingPlaylists: randomIds,
    });
  });

  test("should handle ADD_PLAYING_PLAYLISTS with existing items without duplication", () => {
    const stateWithOnePlayingPlaylistsItem = {
      ...initialState,
      playingPlaylists: [randomIds[0]],
    };

    const stateWithTwoPlayingPlaylistsItem = {
      ...initialState,
      playingPlaylists: randomIds,
    };

    // with oen duplicated item
    expect(
      ytplaylistReducer(
        stateWithOnePlayingPlaylistsItem,

        // @ts-ignore
        addPlayingPlaylistsAction([randomIds[0]])
      )
    ).toEqual(stateWithOnePlayingPlaylistsItem);

    // with two duplicated items
    expect(
      ytplaylistReducer(
        stateWithTwoPlayingPlaylistsItem,

        // @ts-ignore
        addPlayingPlaylistsAction(randomIds)
      )
    ).toEqual(stateWithTwoPlayingPlaylistsItem);
  });

  // ========================================
  // List To Play
  // ========================================
  test("should handle APPEND_LIST_TO_PLAY: add playlist item to listToPlay", () => {
    expect(
      ytplaylistReducer(
        initialState,

        // @ts-ignore
        appendListToPlayAction(playlist.items)
      )
    ).toEqual({
      ...initialState,
      listToPlay: [...playlist.items],
    });
  });

  test("should handle APPEND_LIST_TO_PLAY: add video item to listToPlay", () => {
    expect(
      ytplaylistReducer(
        initialState,

        // @ts-ignore
        appendListToPlayAction(video.items)
      )
    ).toEqual({
      ...initialState,
      listToPlay: [...video.items],
    });
  });

  test("should handle APPEND_LIST_TO_PLAY: add duplicated playlist items", () => {
    expect(
      ytplaylistReducer(
        { ...initialState, listToPlay: [...playlist.items] },

        // @ts-ignore
        appendListToPlayAction(playlist.items)
      )
    ).toEqual({
      ...initialState,
      listToPlay: [...playlist.items],
    });
  });

  test("should handle APPEND_LIST_TO_PLAY: add duplicated video items", () => {
    expect(
      ytplaylistReducer(
        { ...initialState, listToPlay: [...video.items] },

        // @ts-ignore
        appendListToPlayAction(video.items)
      )
    ).toEqual({
      ...initialState,
      listToPlay: [...video.items],
    });
  });

  test("should handle REMOVE_FROM_LIST_TO_PLAY", () => {
    const stateWithExistingLTP = {
      ...initialState,
      listToPlay: [...video.items, ...playlist.items],
    };

    deepFreeze(stateWithExistingLTP);

    // handle remove playlist without mutating stateWithExistingLTP
    expect(
      ytplaylistReducer(
        stateWithExistingLTP,

        // @ts-ignore
        removeFromListToPlayAction([playlist.id], "playlists")
      )
    ).toEqual({
      ...stateWithExistingLTP,
      listToPlay: [...video.items],
    });

    // handle remove video without mutating stateWithExistingLTP
    expect(
      ytplaylistReducer(
        stateWithExistingLTP,

        // @ts-ignore
        removeFromListToPlayAction([video.id], "videos")
      )
    ).toEqual({
      ...stateWithExistingLTP,
      listToPlay: [...playlist.items],
    });

    // handle situation when an empty array is supplied
    expect(
      ytplaylistReducer(
        stateWithExistingLTP,

        // @ts-ignore
        removeFromListToPlayAction([], "videos")
      )
    ).toEqual(stateWithExistingLTP);

    expect(
      ytplaylistReducer(
        stateWithExistingLTP,

        // @ts-ignore
        removeFromListToPlayAction([], "playlists")
      )
    ).toEqual(stateWithExistingLTP);
  });

  test("should handle UPDATE_LIST_TO_PLAY", () => {
    expect(
      ytplaylistReducer(
        initialState,

        // @ts-ignore
        updateListToPlayAction(playlist.items)
      )
    ).toEqual({
      ...initialState,
      listToPlay: playlist.items,
    });

    expect(
      ytplaylistReducer(
        initialState,

        // @ts-ignore
        updateListToPlayAction(video.items)
      )
    ).toEqual({
      ...initialState,
      listToPlay: video.items,
    });
  });

  test("should handle CLEAR_LIST_TO_PLAY", () => {
    expect(
      ytplaylistReducer(
        {
          ...initialState,
          playingPlaylists: ["anyPlaylistId"],
          playingVideos: ["anyVideoId"],
          listToPlay: [...playlist.items],
        },

        // @ts-ignore
        clearListToPlayAction()
      )
    ).toEqual({
      ...initialState,
      playingPlaylists: [],
      playingVideos: [],
      listToPlay: [],
    });
  });
});
