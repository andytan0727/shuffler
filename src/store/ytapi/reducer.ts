import produce, { Draft } from "immer";
import union from "lodash/union";
import { Reducer } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import { YTAPIAction, YTAPIState } from "./types";

const initialState: YTAPIState = {
  apiKey: process.env.REACT_APP_API_KEY!,
  playlistUrl: "",
  playlistItems: {
    apiBaseUrl: "https://www.googleapis.com/youtube/v3/playlistItems",
    options: {
      part: "snippet",
      maxResults: "50",
      playlistId: "",
      fields: [
        "items(id,kind,snippet(title,playlistId,thumbnails,resourceId))",
        "nextPageToken",
      ],
    },
    fetchedData: [],
    fetchLoading: false,
  },
  videoUrl: "",
  videos: {
    apiBaseUrl: "https://www.googleapis.com/youtube/v3/videos",
    options: {
      part: "snippet",
      id: "",
      maxResults: "5",
      fields: ["items(id,kind,snippet(title,thumbnails))"],
    },
    fetchedData: [],
    fetchLoading: false,
  },
  fetchedPlaylistId: [],
  fetchedVideoId: [],
};

export const ytapi: Reducer<YTAPIState, YTAPIAction> = produce(
  (draft: Draft<YTAPIState>, action: YTAPIAction) => {
    switch (action.type) {
      // -------------------------------------
      // Playlists
      // -------------------------------------
      case ActionTypes.FETCH_PLAYLIST_DATA: {
        draft.playlistItems.fetchLoading = true;
        return draft;
      }

      case ActionTypes.FETCH_PLAYLIST_DATA_SUCCESS: {
        draft.playlistItems.fetchLoading = false;

        const dataToAdd = action.payload.data;
        const isDataFetched = draft.playlistItems.fetchedData.some(
          (data) => data.id === dataToAdd.id
        );

        // return if data already fetched before
        if (isDataFetched) {
          return draft;
        }

        // proceed if data is new and fresh
        draft.playlistItems.fetchedData.push(dataToAdd);
        return draft;
      }

      case ActionTypes.FETCH_PLAYLIST_DATA_FAILED: {
        draft.playlistItems.fetchLoading = false;
        return draft;
      }

      case ActionTypes.ADD_FETCHED_PLAYLIST_ID: {
        draft.fetchedPlaylistId = union(draft.fetchedPlaylistId, [
          action.payload.id,
        ]);
        return draft;
      }

      case ActionTypes.SET_PLAYLIST_URL: {
        draft.playlistUrl = action.payload.playlistUrl;
        return draft;
      }

      // -------------------------------------
      // Videos
      // -------------------------------------
      case ActionTypes.FETCH_VIDEO_DATA: {
        draft.videos.fetchLoading = true;
        return draft;
      }

      case ActionTypes.FETCH_VIDEO_DATA_SUCCESS: {
        draft.videos.fetchLoading = false;

        const dataToAdd = action.payload.data;
        const isDataFetched = draft.videos.fetchedData.some(
          (data) => data.items[0].id === dataToAdd.items[0].id
        );

        // return if data already fetched before
        if (isDataFetched) {
          return draft;
        }

        // proceed if data is new and fresh
        draft.videos.fetchedData.push(dataToAdd);
        return draft;
      }

      case ActionTypes.FETCH_VIDEO_DATA_FAILED: {
        draft.videos.fetchLoading = false;
        return draft;
      }

      case ActionTypes.ADD_FETCHED_VIDEO_ID: {
        draft.fetchedVideoId = union(draft.fetchedVideoId, action.payload.id);
        return draft;
      }

      case ActionTypes.SET_VIDEO_URL: {
        draft.videoUrl = action.payload.videoUrl;
        return draft;
      }

      default: {
        return draft;
      }
    }
  },
  initialState
);
