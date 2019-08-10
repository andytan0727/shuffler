import { HandleSetChecked } from "components/Checkbox/hooks";
import memoizeOne from "memoize-one";
import React, { MemoExoticComponent } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";

interface ManagementPanelVirtualListProps {
  itemData: ItemData;
  children: MemoExoticComponent<any>; // shut TS up with the usage of Memo on ListItem
}

export interface ItemData {
  checked: string[];
  handleSetChecked: HandleSetChecked;
  items: string[];
}

/**
 * Get the key of list item to be used in react-window list
 *
 * @param index Array index
 * @param data Item data supplied to FixedSizeList
 * @returns Snippet id as FixedSizeList item's key
 */
const _getItemKey = (index: number, data: ItemData): string | number =>
  data.items[index];

/**
 * Memoized function to create itemData for react-window list
 *
 */
export const createItemData = memoizeOne(
  (
    checked: string[],
    handleSetChecked: HandleSetChecked,
    items: string[]
  ): ItemData => ({
    checked,
    handleSetChecked,
    items,
  })
);

/**
 * ManagementPanelVirtualList component
 *
 * Fixed size list that is used to hold large amount of list items without
 * all the data being loaded at once.
 *
 */
const ManagementPanelVirtualList = (props: ManagementPanelVirtualListProps) => {
  const { itemData, children } = props;

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          height={height - 200}
          width={width}
          itemKey={_getItemKey}
          itemData={itemData}
          itemCount={itemData.items.length}
          itemSize={80}
        >
          {children}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
};

export default ManagementPanelVirtualList;
