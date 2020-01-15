import { useCheckbox } from "components/Checkbox/hooks";
import { createItemData } from "components/Lists/LgPanelVirtualList";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectFilteredSnippets } from "store/ytplaylist/filteredSelectors";

/**
 * useShowFilteredItems allows filtered items (snippets) to be shown on list item
 *
 * For details please refer to LgPanelVirtualList/ LgPanelVirtualListItem
 *
 * @param itemIds An array containing (playlist/listToPlay) item ids
 */
export const useShowFilteredItems = (itemIds: string[]) => {
  const checkboxHooks = useCheckbox();
  const { clearChecked } = checkboxHooks;
  const filteredSnippets = useSelector(selectFilteredSnippets);

  const filteredItems = createItemData({
    ...checkboxHooks,
    itemIds: filteredSnippets?.map((snippet) => snippet.itemId!) ?? itemIds,
  });

  // clear checked mainly on source items deletion
  useEffect(() => {
    clearChecked();
  }, [clearChecked, itemIds]);

  return {
    ...checkboxHooks,
    filteredItems,
  };
};
