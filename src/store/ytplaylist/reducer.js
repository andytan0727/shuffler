import produce from "immer";
import {
  ADD_PLAYLIST,
  REMOVE_PLAYLIST,
  RENAME_PLAYLIST,
  SET_CHECKED_PLAYLISTS,
  SHUFFLE_PLAYLIST,
  SET_LOADED_FROM_DB,
  ADD_LIST_TO_PLAY,
  CLEAR_LIST_TO_PLAY,
  ADD_PLAYING_PLAYLISTS,
  REMOVE_PLAYLIST_FROM_PLAYING,

  // videos
  ADD_VIDEO,
  REMOVE_VIDEO,
  DELETE_VIDEO,
  SET_CHECKED_VIDEOS,
  ADD_PLAYING_VIDEOS,
  TOGGLE_PLAYING_VIDEO,
  REMOVE_VIDEO_FROM_PLAYING,
} from "../../utils/constants/actionConstants";

const initialState = {
  loadedFromDB: false,
  checkedPlaylists: [], // pushed playlistId from selected playlists
  checkedVideos: [], // pushed videoId from checkbox
  playlists: [
    // {
    //   id: "",
    //   name: "",
    //   items: [{}]
    // }
  ],
  videos: [
    // {
    //   id: "",
    //   items: [{}]
    // }
  ],
  listToPlay: [],
  playingPlaylists: [], // id array storing playlists added to playing list
  playingVideos: [], // [ id1, id2, id3 ]
};

export const ytplaylist = produce((draft, action) => {
  switch (action.type) {
    case SET_LOADED_FROM_DB: {
      draft.loadedFromDB = true;
      return draft;
    }

    case ADD_PLAYLIST: {
      draft.playlists = action.payload.updatedPlaylists;
      return draft;
    }

    case REMOVE_PLAYLIST: {
      const { updatedPlaylist, updatedPlayingPlaylists } = action.payload;

      // update playlists, playingPlaylists and checkedPlaylists
      draft.playlists = updatedPlaylist;
      draft.playingPlaylists = updatedPlayingPlaylists;
      draft.checkedPlaylists = [];

      return draft;
    }

    case RENAME_PLAYLIST: {
      draft.playlists = action.payload.updatedPlaylists;
      return draft;
    }

    case SET_CHECKED_PLAYLISTS: {
      // clear checked videos before operating checked videos
      // prevent error caused by simultaneously checked videos and playlists
      if (draft.checkedVideos.length !== 0) {
        draft.checkedVideos = [];
      }

      draft.checkedPlaylists = action.payload.checkedPlaylists;

      return draft;
    }

    case ADD_PLAYING_PLAYLISTS: {
      draft.playingPlaylists = action.payload.updatedPlayingPlaylists;

      return draft;
    }

    case REMOVE_PLAYLIST_FROM_PLAYING: {
      const { updatedListToPlay, updatedPlayingPlaylists } = action.payload;

      draft.listToPlay = updatedListToPlay;
      draft.playingPlaylists = updatedPlayingPlaylists;

      return draft;
    }

    // ------------------------------------------
    // videos
    // ------------------------------------------
    case ADD_VIDEO: {
      draft.videos = action.payload.updatedVideos;
      return draft;
    }

    case REMOVE_VIDEO: {
      const { updatedVideos, updatedPlayingVideos } = action.payload;

      // // update videos, playingVideos and checkedVideos
      draft.videos = updatedVideos;
      draft.playingVideos = updatedPlayingVideos;
      draft.checkedVideos = [];

      return draft;
    }

    case DELETE_VIDEO: {
      const { videos, playingVideos, listToPlay } = action.payload;

      draft.videos = videos;
      draft.playingVideos = playingVideos;
      draft.listToPlay = listToPlay;

      return draft;
    }

    case SET_CHECKED_VIDEOS: {
      // clear checked playlists before operating checked videos
      // prevent error caused by simultaneously checked videos and playlists
      if (draft.checkedPlaylists.length !== 0) {
        draft.checkedPlaylists = [];
      }

      draft.checkedVideos = action.payload.checkedVideos;
      return draft;
    }

    case ADD_PLAYING_VIDEOS: {
      draft.playingVideos = action.payload.updatedPlayingVideos;

      return draft;
    }

    case TOGGLE_PLAYING_VIDEO: {
      const { playingVideos, listToPlay } = action.payload;
      draft.playingVideos = playingVideos;
      draft.listToPlay = listToPlay;

      return draft;
    }

    case REMOVE_VIDEO_FROM_PLAYING: {
      const { updatedListToPlay, updatedPlayingVideos } = action.payload;

      draft.listToPlay = updatedListToPlay;
      draft.playingVideos = updatedPlayingVideos;

      return draft;
    }

    // ------------------------------------------
    // list to play / playingList
    // ------------------------------------------
    case ADD_LIST_TO_PLAY: {
      const {
        updatedListToPlay,
        updatedPlayingPlaylists,
        updatedPlayingVideos,
        checkedListToClear,
      } = action.payload;
      draft.listToPlay = updatedListToPlay;
      draft.playingPlaylists = updatedPlayingPlaylists;
      draft.playingVideos = updatedPlayingVideos;
      if (checkedListToClear === "playlist") {
        draft.checkedPlaylists = [];
      } else {
        draft.checkedVideos = [];
      }

      return draft;
    }

    case CLEAR_LIST_TO_PLAY: {
      // clear listToPlay
      draft.listToPlay = [];

      // clear playingPlaylists and playingVideos as well
      draft.playingPlaylists = [];
      draft.playingVideos = [];

      return draft;
    }

    case SHUFFLE_PLAYLIST: {
      draft.listToPlay = action.payload.updatedListToPlay;
      return draft;
    }

    default: {
      return draft;
    }
  }
}, initialState);
