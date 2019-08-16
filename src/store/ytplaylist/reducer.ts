import produce, { Draft, original } from "immer";
import union from "lodash/union";
import uniqBy from "lodash/uniqBy";
import { Reducer } from "redux";
import * as ActionTypes from "utils/constants/actionConstants";

import {
  DeepROYtPlaylistState,
  YTPlaylistAction,
  YTPlaylistState,
} from "./types";

const initialState: DeepROYtPlaylistState = {
  checkedVideos: [],
  videos: [],
  playingVideos: [],
  listToPlay: [],
};

export const ytplaylist: Reducer<
  DeepROYtPlaylistState,
  YTPlaylistAction
> = produce((draft: Draft<YTPlaylistState>, action: YTPlaylistAction) => {
  switch (action.type) {
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

    default: {
      return draft;
    }
  }
}, initialState);
