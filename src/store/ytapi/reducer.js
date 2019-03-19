import produce from "immer";
import {
  SET_PLAYLIST_ID,
  ADD_FETCHED_DATA
} from "../../utils/constants/actionConstants";

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
    },
    fetchedData: []
  }
};

export const ytapi = produce((draft, action) => {
  switch (action.type) {
    case SET_PLAYLIST_ID: {
      draft.playlistItems.options.playlistId = action.payload.playlistId;
      return draft;
    }

    case ADD_FETCHED_DATA: {
      const dataToAdd = action.payload.data;
      const isDataFetched = draft.playlistItems.fetchedData.some(
        data => data.items[0].id === dataToAdd.items[0].id
      );

      // return if data already fetched before
      if (isDataFetched) {
        return draft;
      }

      // proceed if data is new and fresh
      draft.playlistItems.fetchedData.push(dataToAdd);
      return draft;
    }

    default: {
      return draft;
    }
  }
}, initialState);
