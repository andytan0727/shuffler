import { useCallback } from "react";
import { DropResult } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { selectCurSongIdx, selectPlaying } from "store/ytplayer/selector";
import { reorderVideoItem } from "store/ytplaylist/videoActions";
import { selectVideoItemCount } from "store/ytplaylist/videoSelectors";
import { isFiltering } from "utils/helper/generalHelper";
import { notify } from "utils/helper/notifyHelper";

export const useDragVideoItem = () => {
  const isPlayerPlaying = useSelector(selectPlaying);
  const curSongIdx = useSelector(selectCurSongIdx);
  const videoItemCount = useSelector(selectVideoItemCount);
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

      // just put as consistency since video panel
      // doesn't have filter function
      if (isFiltering(itemCount, videoItemCount)) {
        notify("warning", "Please don't drag while filtering");
        return;
      }

      dispatch(reorderVideoItem(fromIdx, toIdx));
    },
    [curSongIdx, dispatch, isPlayerPlaying, videoItemCount]
  );

  return {
    handleOnDragEnd,
  };
};
