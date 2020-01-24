import { useCallback } from "react";
import { DropResult } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { selectCurSongIdx, selectPlaying } from "store/ytplayer/selector";
import { reorderListToPlayItemAction } from "store/ytplaylist/listToPlayActions";
import { selectListToPlayTotalItems } from "store/ytplaylist/listToPlaySelectors";
import { isFiltering } from "utils/helper/generalHelper";
import { notify } from "utils/helper/notifyHelper";

export const useDragListToPlayItem = () => {
  const isPlayerPlaying = useSelector(selectPlaying);
  const curSongIdx = useSelector(selectCurSongIdx);
  const listToPlayItemCount = useSelector(selectListToPlayTotalItems);
  const dispatch = useDispatch();

  const handleOnDragEnd = useCallback(
    (itemCount: number) => (result: DropResult) => {
      if (!result.destination) {
        return;
      }

      const fromIdx = result.source.index;
      const toIdx = result.destination.index;

      if (fromIdx === toIdx) {
        return;
      }

      // NOTE: experimental.
      // Test whether this condition is suitable or not
      // to prohibit the drag action
      if (fromIdx === curSongIdx && isPlayerPlaying) {
        notify("warning", "Please don't move the first item while playing");
        return;
      }

      if (isFiltering(itemCount, listToPlayItemCount)) {
        notify("warning", "Please don't drag while filtering");
        return;
      }

      dispatch(reorderListToPlayItemAction(fromIdx, toIdx));
    },
    [curSongIdx, dispatch, isPlayerPlaying, listToPlayItemCount]
  );

  return {
    handleOnDragEnd,
  };
};
