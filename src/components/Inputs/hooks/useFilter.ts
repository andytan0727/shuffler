import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "store";
import {
  clearFilteredSnippets,
  createFuse,
  fuzzySearchSnippetsByTitle,
} from "store/ytplaylist/filteredActions";
import { selectSnippetsByItemIds } from "store/ytplaylist/generalSelectors";

/**
 * useFilter hooks
 *
 * Hooks used for filtering playlist/video/listToPlay items
 *
 * @param itemIds ItemIds for getting snippets
 * @returns States and handlers for filtering snippets
 */
const useFilter = (itemIds: string[]) => {
  const [filterValue, setFilterValue] = useState("");
  const snippets = useSelector((state: AppState) =>
    selectSnippetsByItemIds(state, itemIds)
  );
  const dispatch = useDispatch();

  const debouncedSearch = debounce((value: string) => {
    dispatch(fuzzySearchSnippetsByTitle(value));
  }, 50);

  const handleFilter = useCallback(
    (e: InputChangeEvent) => {
      const value = e.target.value;

      // make text field a controlled component
      setFilterValue(value);

      if (!value) {
        dispatch(clearFilteredSnippets());
      } else {
        debouncedSearch(value);
      }
    },
    [debouncedSearch, dispatch, setFilterValue]
  );

  useEffect(() => {
    // create fuse on mount and on snippets change
    dispatch(createFuse(snippets));
  }, [dispatch, snippets]);

  // Clear filtered snippets and make it undefined
  // when the filter component is unmounted.
  // This can prevent previously filtered snippets
  // show on another panel
  useEffect(() => {
    dispatch(clearFilteredSnippets());

    // clear filter input
    setFilterValue("");
  }, [dispatch]);

  return {
    filterValue,
    handleFilter,

    // lower level function
    // directly set filter value (not recommended)
    setFilterValue,
  };
};

export default useFilter;
