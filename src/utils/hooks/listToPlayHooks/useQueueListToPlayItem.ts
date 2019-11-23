import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FixedSizeList } from "react-window";
import { setCurSongIdx } from "store/ytplayer/action";
import { selectCurSongIdx } from "store/ytplayer/selector";
import { queueListToPlayItemAction } from "store/ytplaylist/listToPlayActions";
import { selectListToPlayResult } from "store/ytplaylist/listToPlaySelectors";
import { notify } from "utils/helper/notifyHelper";

type ListRef = React.RefObject<FixedSizeList>;

/**
 * Check if the selected song is next to currently
 * playing song or else. Reduce curSongIdx by 1 if
 * the selected item s before currently playing
 *
 * @param curSongIdx Currently playing song idx
 * @param selectedSongIdx Selected song idx
 * @returns New idx
 */
const checkIfNextToPlay = (curSongIdx: number, selectedSongIdx: number) => {
  let newSongIdx = curSongIdx;

  return curSongIdx > selectedSongIdx ? --newSongIdx : newSongIdx;
};

/**
 * Scroll to selected item identified by curSongIdx.
 * Wrapper around FixedSizeList's scrollToItem
 *
 * @param listRef Ref object of FixedSizeList
 * @param curSongIdx Currently playing song idx
 */
const scrollToCurPlaying = (listRef: ListRef, curSongIdx: number) => {
  // scroll to start after queueing
  const curListRef = listRef.current;

  if (curListRef) {
    curListRef.scrollToItem(curSongIdx, "start");
  }
};

/**
 * useQueueListToPlayItem is a hook to queue the selected video
 * to second after the currently playing video. If the selected
 * video is played prior to currently playing video, a warning
 * will be shown to user and the action will not dispatch.
 *
 * @param itemIdx Index of selected item
 * @param listRef Ref of list component (FixedSizeList)
 * @returns Object containing handler function to queue listToPlay item
 */
export const useQueueListToPlayItem = (itemIdx: number, listRef: ListRef) => {
  const dispatch = useDispatch();
  const curSongIdx = useSelector(selectCurSongIdx);
  const listToPlayResult = useSelector(selectListToPlayResult);

  const handleQueueListToPlayItem = useCallback(() => {
    // warn and abort further actions if user clicked currently
    // playing video
    if (curSongIdx === itemIdx) {
      notify("warning", "You can't queue currently playing video.");
      return;
    }

    const newSongIdx = checkIfNextToPlay(curSongIdx, itemIdx);
    const { id } = listToPlayResult[itemIdx];
    dispatch(queueListToPlayItemAction(newSongIdx, id));

    // keep the video playing when queueing
    dispatch(setCurSongIdx(newSongIdx));

    // scroll to start after queueing
    scrollToCurPlaying(listRef, curSongIdx);
  }, [curSongIdx, dispatch, itemIdx, listRef, listToPlayResult]);

  return {
    handleQueueListToPlayItem,
  };
};
