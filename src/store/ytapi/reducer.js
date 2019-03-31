import produce from "immer";
import {
  SET_PLAYLIST_URL,
  FETCH_PLAYLIST_DATA,
  ADD_FETCHED_ITEM_ID,
} from "../../utils/constants/actionConstants";

const initialState = {
  // still inspectable in client-side through console
  apiKey: process.env.REACT_APP_API_KEY,
  playlistUrl: "",
  playlistItems: {
    apiBaseUrl: "https://www.googleapis.com/youtube/v3/playlistItems",
    options: {
      part: "snippet",
      maxResults: "50",
      playlistId: "",
      fields: ["items", "nextPageToken", "pageInfo"],
    },
    fetchedData: [],
  },
  fetchedItemsId: [],
};

export const ytapi = produce((draft, action) => {
  switch (action.type) {
    case SET_PLAYLIST_URL: {
      draft.playlistUrl = action.payload.playlistUrl;
      return draft;
    }

    case FETCH_PLAYLIST_DATA: {
      const dataToAdd = action.payload.data;
      const isDataFetched = draft.playlistItems.fetchedData.some(
        (data) => data.items[0].id === dataToAdd.items[0].id
      );

      // return if data already fetched before
      if (isDataFetched) {
        return draft;
      }

      // proceed if data is new and fresh
      draft.playlistItems.fetchedData.push(dataToAdd);

      return draft;
    }

    case ADD_FETCHED_ITEM_ID: {
      const playlistIdToAdd = action.payload.id;

      // push fetched playlist id to fetched items array if not exists
      if (!draft.fetchedItemsId.includes(playlistIdToAdd)) {
        const updatedFetchedItemsId = [
          ...draft.fetchedItemsId,
          playlistIdToAdd,
        ];
        draft.fetchedItemsId = updatedFetchedItemsId;
      }

      return draft;
    }

    default: {
      return draft;
    }
  }
}, initialState);
