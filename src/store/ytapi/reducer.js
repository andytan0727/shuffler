import produce from "immer";
import { SET_PLAYLIST_ID } from "../../utils/constants/actionConstants";

const initialState = {
  // still inspectable in client-side through console
  apiKey: process.env.REACT_APP_API_KEY,
  playlistItems: {
    apiBaseUrl: "https://www.googleapis.com/youtube/v3/playlistItems",
    options: {
      part: "snippet",
      maxResults: "50",
      playlistId: "",
      fields: ["items", "nextPageToken", "pageInfo"]
    }
  }
};

export const ytapi = produce((draft, action) => {
  switch (action.type) {
    case SET_PLAYLIST_ID: {
      draft.playlistItems.options.playlistId = action.payload.playlistId;
      return draft;
    }

    default: {
      return draft;
    }
  }
}, initialState);
