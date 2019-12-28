import Fuse from "fuse.js";
import produce, { Draft, original } from "immer";
import { Reducer } from "typesafe-actions";
import {
  CLEAR_FILTERED_SNIPPETS,
  CREATE_FUSE,
  FUZZY_SEARCH_SNIPPETS_BY_TITLE,
  REMOVE_FILTERED_SNIPPETS_BY_ITEM_IDS,
} from "utils/constants/actionConstants";

import {
  DeepReadonlyFiltered,
  Filtered,
  ListToPlaySnippets,
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
    case CREATE_FUSE: {
      const { snippets } = action.payload;
      const options = original(draft.options);

      if (options) draft.fuse = new Fuse(snippets, options);

      return draft;
    }

    case FUZZY_SEARCH_SNIPPETS_BY_TITLE: {
      const { title } = action.payload;

      if (!draft.fuse) {
        throw new Error("Please create Fuse object first before search");
      }

      // settle the problem of improper return type
      // inference of fuse search
      draft.snippets = draft.fuse.search(title) as ListToPlaySnippets;
      return draft;
    }

    case CLEAR_FILTERED_SNIPPETS: {
      draft.snippets = undefined;
      return draft;
    }

    case REMOVE_FILTERED_SNIPPETS_BY_ITEM_IDS: {
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
