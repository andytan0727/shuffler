import debounce from "lodash/debounce";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "store";
import {
  clearFilteredSnippets,
  createFuse,
  fuzzySearchSnippetsByTitle,
} from "store/ytplaylist/filteredActions";
import { selectNormSnippetsByItemIds } from "store/ytplaylist/generalSelectors";

import TextField from "@material-ui/core/TextField";

export interface FilterSnippetInputProps {
  itemIds: string[];
}

const FilterSnippetInput = (props: FilterSnippetInputProps) => {
  const { itemIds } = props;
  const snippets = useSelector((state: AppState) =>
    selectNormSnippetsByItemIds(state, itemIds)
  );
  const dispatch = useDispatch();

  const debouncedSearch = debounce((value: string) => {
    dispatch(fuzzySearchSnippetsByTitle(value));
  }, 50);

  const handleSearch = useCallback(
    (e: InputChangeEvent) => {
      const value = e.target.value;

      if (!value) {
        dispatch(clearFilteredSnippets());
      } else {
        debouncedSearch(value);
      }
    },
    [debouncedSearch, dispatch]
  );

  // create fuse on mount and on snippets change
  useEffect(() => {
    dispatch(createFuse(snippets));
  }, [dispatch, snippets]);

  return (
    <React.Fragment>
      <TextField
        id="filter"
        label="filter"
        placeholder="filter by title"
        onChange={handleSearch}
        margin="dense"
        variant="outlined"
      />
    </React.Fragment>
  );
};

export default FilterSnippetInput;
