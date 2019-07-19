import React, { forwardRef, memo } from "react";
import {
  VariableSizeList,
  FixedSizeList,
  areEqual,
  ListChildComponentProps,
} from "react-window";
import { ListToPlayItems } from "store/ytplaylist/types";

import styles from "./styles.module.scss";

interface VideoListItemProps {
  index: number;
  style: any;
  data: ListToPlayItems;
}

interface VideoListProps {
  items: ListToPlayItems;
  width?: number | string;
  height?: number | string;
  isMobile?: boolean;
  children?:
    | React.MemoExoticComponent<any>
    | React.ComponentType<ListChildComponentProps>;
}

const VideoListItem = memo((props: VideoListItemProps) => {
  const { index, style, data } = props;

  return (
    <div className={styles.listItem} style={style}>
      {data[index].snippet.title}
    </div>
  );
}, areEqual);

VideoListItem.displayName = "VideoListItem";

const getItemKey = (index: number, data: ListToPlayItems) => data[index].id;

const VideoList = forwardRef(
  (props: VideoListProps, ref: React.Ref<VariableSizeList | FixedSizeList>) => {
    const { items, width, height, isMobile, children } = props;

    const getMobileListItemSize = (index: number) =>
      ((items[index].snippet.title.length * 16) / (width as number)) * 20;

    return isMobile ? (
      <VariableSizeList
        ref={ref as React.Ref<VariableSizeList>}
        height={height || 350}
        className={styles.songList}
        itemCount={items.length}
        itemData={items}
        itemKey={getItemKey}
        itemSize={getMobileListItemSize}
        width={width || 400}
      >
        {children || VideoListItem}
      </VariableSizeList>
    ) : (
      <FixedSizeList
        ref={ref as React.Ref<FixedSizeList>}
        height={height || 350}
        className={styles.songList}
        itemCount={items.length}
        itemData={items}
        itemKey={getItemKey}
        itemSize={90}
        width={width || 400}
      >
        {children || VideoListItem}
      </FixedSizeList>
    );
  }
);

VideoList.displayName = "VideoList";

export default VideoList;
