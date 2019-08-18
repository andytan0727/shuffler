import {
  CheckboxHooksReturn,
  HandleCheckOrUncheckId,
} from "components/Checkbox/hooks";
import memoizeOne from "memoize-one";
import React, { MemoExoticComponent, useCallback } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { ListToPlaySnippets } from "store/ytplaylist/types";

import VirtualListSelectionHeader from "../VirtualListSelectionHeader";

interface ManagementPanelVirtualListProps {
  itemData: ItemData;
  children: MemoExoticComponent<any>; // shut TS up with the usage of Memo on ListItem
}

export interface ItemData {
  checked: string[];
  handleCheckOrUncheckId: HandleCheckOrUncheckId;

  // for select all / clear selected functionality
  // if client components do not plan to implement
  // those functionality, then both of the functions
  // can be ignored
  clearChecked?: CheckboxHooksReturn["clearChecked"];
  setChecked?: CheckboxHooksReturn["setChecked"];

  // main list items to render
  items: string[];

  // filtered list of snippets to be displayed
  // if not supplied/undefined then items will be displayed instead
  filteredSnippets?: ListToPlaySnippets;
}

interface ManagementPanelVirtualListProps {
  itemData: ItemData;
  children: MemoExoticComponent<any>; // shut TS up with the usage of Memo on ListItem
}

/**
 * Get the key of list item to be used in react-window list
 *
 * @param index Array index
 * @param data Item data supplied to FixedSizeList
 * @returns Id as FixedSizeList item's key
 */
const _getItemKey = (index: number, data: ItemData): string | number =>
  data.filteredSnippets ? data.filteredSnippets[index].id! : data.items[index];

/**
 * Memoized function to create itemData for react-window list
 *
 */
export const createItemData = memoizeOne((itemData: ItemData) => itemData);

/**
 * ManagementPanelVirtualList component
 *
 * Fixed size list that is used to hold large amount of list items without
 * all the data being loaded at once.
 *
 */
const ManagementPanelVirtualList = (props: ManagementPanelVirtualListProps) => {
  const { itemData, children } = props;
  const {
    checked,
    clearChecked,
    setChecked,
    filteredSnippets,
    items,
  } = itemData;
  const itemCount = filteredSnippets ? filteredSnippets.length : items.length;

  // select (check) all filteredSnippets if they exist
  // else select all original items
  const handleSelectAll = useCallback(() => {
    if (setChecked) {
      setChecked(
        filteredSnippets
          ? filteredSnippets.map((snippet) => snippet.itemId!)
          : items
      );
    }
  }, [filteredSnippets, items, setChecked]);

  const handleClearSelected = useCallback(() => {
    if (clearChecked) {
      clearChecked();
    }
  }, [clearChecked]);

  // prevent property undefined error if no items/filteredSnippets
  return itemCount === 0 ? (
    <div>No video found</div>
  ) : (
    <AutoSizer>
      {({ height, width }) => (
        <React.Fragment>
          <VirtualListSelectionHeader
            width={width}
            isChecked={checked.length !== 0}
            isAllChecked={checked.length === itemCount}
            checkedItemsCount={checked.length}
            handleSelectAll={handleSelectAll}
            handleClearSelected={handleClearSelected}
          />

          <FixedSizeList
            height={height - 230}
            width={width}
            itemKey={_getItemKey}
            itemData={itemData}
            itemCount={itemCount}
            itemSize={80}
          >
            {children}
          </FixedSizeList>
        </React.Fragment>
      )}
    </AutoSizer>
  );
};

export default ManagementPanelVirtualList;
