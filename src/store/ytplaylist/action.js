import { ADD_PLAYLIST_ITEMS } from "../../utils/constants/actionConstants";

const addPlaylistItems = items => ({
  type: ADD_PLAYLIST_ITEMS,
  payload: {
    items
  }
});

export { addPlaylistItems };
