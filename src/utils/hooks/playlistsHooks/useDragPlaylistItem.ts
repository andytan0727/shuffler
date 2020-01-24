import { useCallback } from "react";
import { DropResult } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "store";
import { selectCurSongIdx, selectPlaying } from "store/ytplayer/selector";
import { reorderPlaylistItemByPlaylistIdAction } from "store/ytplaylist/playlistActions";
import { selectPlaylistItemCountByPlaylistId } from "store/ytplaylist/playlistSelectors";
import { isFiltering } from "utils/helper/generalHelper";
import { notify } from "utils/helper/notifyHelper";

export const useDragPlaylistItem = (playlistId: string) => {
  const isPlayerPlaying = useSelector(selectPlaying);
  const curSongIdx = useSelector(selectCurSongIdx);
  const playlistItemCount = useSelector((state: AppState) =>
    selectPlaylistItemCountByPlaylistId(state, playlistId)
  );
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

      if (isFiltering(itemCount, playlistItemCount)) {
        notify("warning", "Please don't drag while filtering");
        return;
      }

      dispatch(
        reorderPlaylistItemByPlaylistIdAction(playlistId, fromIdx, toIdx)
      );
    },
    [curSongIdx, dispatch, isPlayerPlaying, playlistId, playlistItemCount]
  );

  return {
    handleOnDragEnd,
  };
};
