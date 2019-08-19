import Fuse from "fuse.js";
import produce, { Draft, original } from "immer";
import { Reducer } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import {
  DeepReadonlyFiltered,
  Filtered,
  PlaylistItemSnippet,
  VideoItemSnippet,
  YTPlaylistActions,
} from "./types";

const initialFilteredState: DeepReadonlyFiltered = {
  fuse: undefined,
  options: {
    keys: ["title"],
  },
  snippets: undefined,
};

export const filteredReducer: Reducer<
  DeepReadonlyFiltered,
  YTPlaylistActions
> = produce((draft: Draft<Filtered>, action: YTPlaylistActions) => {
  switch (action.type) {
    case ActionTypes.CREATE_FUSE: {
      const { snippets } = action.payload;
      const options = original(draft.options);

      if (options)
        draft.fuse = new Fuse(
          snippets as (PlaylistItemSnippet | VideoItemSnippet)[],
          options
        );

      return draft;
    }

    case ActionTypes.FUZZY_SEARCH_SNIPPETS_BY_TITLE: {
      const { title } = action.payload;

      if (!draft.fuse) {
        throw new Error("Please create Fuse object first before search");
      }

      draft.snippets = draft.fuse.search(title);
      return draft;
    }

    case ActionTypes.CLEAR_FILTERED_SNIPPETS: {
      draft.snippets = undefined;
      return draft;
    }

    case ActionTypes.REMOVE_FILTERED_SNIPPETS_BY_ITEM_IDS: {
      const { itemIds } = action.payload;
      const prevFilteredSnippets = original(draft.snippets);

      if (prevFilteredSnippets) {
        draft.snippets = prevFilteredSnippets.filter(
          (snippet) => snippet.itemId && !itemIds.includes(snippet.itemId)
        );
      }

      return draft;
    }

    default:
      return draft;
  }
}, initialFilteredState);
