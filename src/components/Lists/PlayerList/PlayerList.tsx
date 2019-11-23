import React, { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { selectPreferDarkTheme } from "store/userPreferences/selector";
import { selectCurSongIdx } from "store/ytplayer/selector";
import { ListToPlaySnippets } from "store/ytplaylist/types";

import { makeStyles, useMediaQuery } from "@material-ui/core";

import { withPlayerListRef } from "./PlayerListItem";

interface PlayerListProps {
  items: ListToPlaySnippets;
}

const useStyles = makeStyles({
  playerListContainer: (props: { preferDarkTheme: boolean }) => ({
    backgroundImage: props.preferDarkTheme
      ? "radial-gradient(circle, #33003a, #2f0135, #2c0131, #28012c, #250028)"
      : "none",
  }),
});

const _getItemKey = (
  index: number,
  data: ListToPlaySnippets
): string | number => data[index].id || data[index].title; // fall back to title if id does not exist

const PlayerList = (props: PlayerListProps) => {
  const { items } = props;
  const preferDarkTheme = useSelector(selectPreferDarkTheme);
  const classes = useStyles({
    preferDarkTheme,
  });
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
            className={classes.playerListContainer}
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
