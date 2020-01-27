import { useCallback } from "react";
import { DropResult } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { selectCurSongIdx, selectPlaying } from "store/ytplayer/selector";
import { reorderListToPlayItemAction } from "store/ytplaylist/listToPlayActions";
import { reorderPlaylistItemByPlaylistIdAction } from "store/ytplaylist/playlistActions";
import { reorderVideoItem } from "store/ytplaylist/videoActions";
import { ActionType } from "typesafe-actions";
import { isFiltering } from "utils/helper/generalHelper";
import { notify } from "utils/helper/notifyHelper";

export const useOnDragEnd = (
  oriItemCount: number,
  reorderAction: (
    fromIdx: number,
    toIdx: number
  ) => ActionType<
    | typeof reorderListToPlayItemAction
    | typeof reorderPlaylistItemByPlaylistIdAction
    | typeof reorderVideoItem
  >
) => {
  const isPlayerPlaying = useSelector(selectPlaying);
  const curSongIdx = useSelector(selectCurSongIdx);
  const dispatch = useDispatch();

  const handleOnDragEnd = useCallback(
    (curItemCount: number) => (result: DropResult) => {
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

      // disable drag n drop on filtering
      if (isFiltering(oriItemCount, curItemCount)) {
        notify("warning", "Please don't drag while filtering");
        return;
      }

      dispatch(reorderAction(fromIdx, toIdx));
    },
    [oriItemCount, curSongIdx, dispatch, isPlayerPlaying, reorderAction]
  );

  return {
    handleOnDragEnd,
  };
};
