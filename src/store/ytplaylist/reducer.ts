import produce, { original, Draft } from "immer";
import uniqBy from "lodash/uniqBy";
import union from "lodash/union";
import {
  YTPlaylistState,
  YTPlaylistAction,
  DeepROYtPlaylistState,
} from "./types";
import * as ActionTypes from "../../utils/constants/actionConstants";
import { Reducer } from "redux";

const initialState: DeepROYtPlaylistState = {
  checkedPlaylists: [],
  checkedVideos: [],
  playlists: [],
  videos: [],
  listToPlay: [],
  playingPlaylists: [],
  playingVideos: [],
};

export const ytplaylist: Reducer<
  DeepROYtPlaylistState,
  YTPlaylistAction
> = produce((draft: Draft<YTPlaylistState>, action: YTPlaylistAction) => {
  switch (action.type) {
    // NOTE: TESTED
    case ActionTypes.ADD_PLAYLIST: {
      const playlistToAdd = action.payload.playlist;
      const isPlaylistExists = draft.playlists.some(
        (playlist) => playlist.id === playlistToAdd.id
      );

      // return if playlist already existed
      if (isPlaylistExists) return draft;

      // proceeds to add playlist if it does not exist yet
      draft.playlists.push(playlistToAdd);
      return draft;
    }

    // NOTE: TESTED
    case ActionTypes.DELETE_PLAYLISTS: {
      const playlistIdsToRemove = action.payload.playlistIds;
      draft.playlists = draft.playlists.filter(
        (playlist) => !playlistIdsToRemove.includes(playlist.id)
      );
      return draft;
    }

    // NOTE: TESTED
    case ActionTypes.RENAME_PLAYLIST: {
      const { newName, playlistIdToRename } = action.payload;
      const prevPlaylists = original(draft.playlists);

      if (prevPlaylists)
        draft.playlists = prevPlaylists.map((playlist) => {
          if (playlist.id === playlistIdToRename) {
            playlist.name = newName;
          }
          return playlist;
        });

      return draft;
    }

    // NOTE: TESTED
    case ActionTypes.SET_CHECKED_PLAYLISTS: {
      // clear checked videos before operating checked videos
      // prevent error caused by simultaneously checked videos and playlists
      if (draft.checkedVideos.length !== 0) {
        draft.checkedVideos = [];
      }

      draft.checkedPlaylists = action.payload.checkedPlaylists;
      return draft;
    }

    // NOTE: TESTED
    case ActionTypes.ADD_PLAYING_PLAYLISTS: {
      const playlistIds = action.payload.playlistIds;
      const prevPlayingPlaylists = original(draft.playingPlaylists);

      if (prevPlayingPlaylists)
        draft.playingPlaylists = union(prevPlayingPlaylists, playlistIds);

      return draft;
    }

    case ActionTypes.REMOVE_PLAYING_PLAYLISTS: {
      const playlistIdsToRemove = action.payload.playlistIds;
      draft.playingPlaylists = draft.playingPlaylists.filter(
        (playlistId) => !playlistIdsToRemove.includes(playlistId)
      );
      return draft;
    }

    // ------------------------------------------
    // videos
    // ------------------------------------------
    case ActionTypes.ADD_VIDEO: {
      const { videoToAdd } = action.payload;

      const isVideoExists = draft.videos.some(
        (video) => video.id === videoToAdd.id
      );

      // return if video exists
      if (isVideoExists) {
        return draft;
      }

      draft.videos.push(videoToAdd);
      return draft;
    }

    case ActionTypes.DELETE_VIDEOS: {
      const videoIdsToRemove = action.payload.videoIds;
      const prevVideos = original(draft.videos);

      if (prevVideos)
        draft.videos = prevVideos.filter(
          (video) => !videoIdsToRemove.includes(video.id)
        );

      return draft;
    }

    case ActionTypes.SET_CHECKED_VIDEOS: {
      // clear checked playlists before operating checked videos
      // prevent error caused by simultaneously checked videos and playlists
      if (draft.checkedPlaylists.length !== 0) {
        draft.checkedPlaylists = [];
      }

      draft.checkedVideos = action.payload.checkedVideos;
      return draft;
    }

    case ActionTypes.ADD_PLAYING_VIDEOS: {
      const videoIds = action.payload.videoIds;
      const prevPlayingVideos = original(draft.playingVideos);

      if (prevPlayingVideos)
        draft.playingVideos = union(prevPlayingVideos, videoIds);

      return draft;
    }

    case ActionTypes.REMOVE_PLAYING_VIDEOS: {
      const videoIdsToRemove = action.payload.videoIds;
      const prevPlayingVideos = original(draft.playingVideos);

      if (prevPlayingVideos)
        draft.playingVideos = prevPlayingVideos.filter(
          (videoId) => !videoIdsToRemove.includes(videoId)
        );

      return draft;
    }

    // ------------------------------------------
    // list to play / playingList
    // ------------------------------------------
    // NOTE: TESTED
    case ActionTypes.APPEND_LIST_TO_PLAY: {
      const items = action.payload.items;
      const prevListToPlay = original(draft.listToPlay);

      if (prevListToPlay)
        draft.listToPlay = uniqBy([...prevListToPlay, ...items], "id");

      return draft;
    }

    // NOTE: TESTED
    case ActionTypes.REMOVE_FROM_LIST_TO_PLAY: {
      const { itemIds, itemType } = action.payload;
      const prevListToPlay = original(draft.listToPlay);

      if (prevListToPlay)
        draft.listToPlay = prevListToPlay.filter((item) =>
          itemType === "playlists" && "playlistId" in item.snippet
            ? !itemIds.includes(item.snippet.playlistId)
            : !itemIds.includes(item.id)
        );

      return draft;
    }

    // NOTE: TESTED
    case ActionTypes.UPDATE_LIST_TO_PLAY: {
      draft.listToPlay = action.payload.listToPlay;
      return draft;
    }

    // NOTE: TESTED
    case ActionTypes.CLEAR_LIST_TO_PLAY: {
      // clear listToPlay
      draft.listToPlay = [];

      // clear playingPlaylists and playingVideos as well
      draft.playingPlaylists = [];
      draft.playingVideos = [];

      return draft;
    }

    default: {
      return draft;
    }
  }
}, initialState);
