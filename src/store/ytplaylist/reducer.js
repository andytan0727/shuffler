import produce from "immer";
import { ADD_PLAYLIST_ITEMS } from "../../utils/constants/actionConstants";

const initialState = {
  items: []
};

export const ytplaylist = produce((draft, action) => {
  switch (action.type) {
    case ADD_PLAYLIST_ITEMS: {
      const itemsToAdd = action.payload.items;
      const isItemExists = draft.items.some(
        item => item.id === itemsToAdd[0].id
      );

      // return if items arr already contains any item from itemsToAdd arr
      if (isItemExists) {
        return draft;
      }

      // if the itemsToAdd is unique then push all its elem to items arr
      draft.items.push(...itemsToAdd);
      return draft;
    }

    default: {
      return draft;
    }
  }
}, initialState);
