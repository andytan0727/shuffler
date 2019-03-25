import produce from "immer";
import {
  SET_PLAYLIST_ID,
  FETCH_PLAYLIST_DATA,
  ADD_FETCHED_ITEM_ID
} from "../../utils/constants/actionConstants";

import { dbFetchedItem } from "../../utils/helper/dbHelper";

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
  },
  fetchedItemsId: []
};

export const ytapi = produce((draft, action) => {
  switch (action.type) {
    case SET_PLAYLIST_ID: {
      draft.playlistItems.options.playlistId = action.payload.playlistId;
      return draft;
    }

    case FETCH_PLAYLIST_DATA: {
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

    case ADD_FETCHED_ITEM_ID: {
      const playlistIdToAdd = action.payload.id;

      // push fetched playlist id to fetched items array if not exists
      if (!draft.fetchedItemsId.includes(playlistIdToAdd)) {
        const updatedFetchedItemsId = [
          ...draft.fetchedItemsId,
          playlistIdToAdd
        ];
        draft.fetchedItemsId = updatedFetchedItemsId;

        // add to indexedDB as well
        dbFetchedItem
          .setItem("fetchedItems", draft.fetchedItemsId)
          .then(() =>
            console.log("successfully added fetchedItemsId to playlistDB")
          )
          .catch(err => console.log(err));
      }

      return draft;
    }

    default: {
      return draft;
    }
  }
}, initialState);
