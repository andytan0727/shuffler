import React, { MemoExoticComponent } from "react";
import memoizeOne from "memoize-one";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useCheckbox } from "components/Checkbox/hooks";

export interface ItemData {
  checked: string[];
  handleSetChecked: (id: string) => (e: OnClickEvent) => void;
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

interface ManagementPanelVirtualListProps {
  items: string[];
  children: MemoExoticComponent<any>; // shut TS up with the usage of Memo on ListItem
}

const createItemData = memoizeOne(
  (
    checked: string[],
    handleSetChecked: (id: string) => (e: OnClickEvent) => void,
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
  // items is an array containing id of playlistItem/videoItem
  const { items, children } = props;
  const { checked, handleSetChecked } = useCheckbox();
  const itemData = createItemData(checked, handleSetChecked, items);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          height={height - 200}
          width={width}
          itemKey={_getItemKey}
          itemData={itemData}
          itemCount={items.length}
          itemSize={80}
        >
          {children}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
};

export default ManagementPanelVirtualList;
