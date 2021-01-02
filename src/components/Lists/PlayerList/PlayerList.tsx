import React, { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { selectCurSongIdx } from "store/ytplayer/selector";
import { ListToPlaySnippets } from "store/ytplaylist/types";

import { useMediaQuery } from "@material-ui/core";

import { withPlayerListRef } from "./PlayerListItem";

interface PlayerListProps {
  items: ListToPlaySnippets;
}

const _getItemKey = (
  index: number,
  data: ListToPlaySnippets
): string | number => data[index].id || data[index].title; // fall back to title if id does not exist

const PlayerList = (props: PlayerListProps) => {
  const { items } = props;
  const curSongIdx = useSelector(selectCurSongIdx);
  const listRef = useRef<FixedSizeList>(null);
  const matchLargeDisplay = useMediaQuery("(min-width: 950px)");
  const itemCount = items.length;
  const PlayerListItem = useMemo(() => withPlayerListRef(listRef), [listRef]);

  useEffect(() => {
    const currentListRef = listRef.current;
    // scroll to current song in playing list
    if (currentListRef) {
      currentListRef.scrollToItem(curSongIdx, "start");
    }
  }, [curSongIdx]);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <React.Fragment>
          <FixedSizeList
            ref={listRef}
            height={matchLargeDisplay ? height - 128.6 : height - 62}
            width={width}
            itemKey={_getItemKey}
            itemData={items}
            itemCount={itemCount}
            itemSize={matchLargeDisplay ? height * 0.116 : 90}
          >
            {PlayerListItem}
          </FixedSizeList>
        </React.Fragment>
      )}
    </AutoSizer>
  );
};

export default PlayerList;
