import React from "react";
import PropTypes from "prop-types";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

/**
 * Get the key of list item to be used in react-window list
 *
 * @param {number | string} index
 * @param {Array<PlaylistItem> | Array<VideoItem>} data
 */
const _getItemKey = (index, data) => data[index] && data[index].id;

/**
 * ManagementPanelVirtualList component
 *
 * Fixed size list that is used to hold large amount of list items without
 * all the data being loaded at once.
 *
 * @param {{
 *   items: Array<PlaylistItem>
 *        | Array<VideoItem>
 *        | ListToPlay;
 *   children: React.ComponentClass<import("react-window").ListChildComponentProps, any>; }} props
 * @returns
 */
const ManagementPanelVirtualList = (props) => {
  const { items, children } = props;

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          height={height - 200}
          width={width}
          itemKey={_getItemKey}
          itemData={items}
          itemCount={items.length}
          itemSize={80}
        >
          {children}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
};

ManagementPanelVirtualList.propTypes = {
  items: PropTypes.array.isRequired,
};

export default ManagementPanelVirtualList;
