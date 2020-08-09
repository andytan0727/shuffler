import { useCallback } from "react";
import { DropResult } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { setCurSongIdx } from "store/ytplayer/action";
import { selectCurSongIdx } from "store/ytplayer/selector";
import { reorderListToPlayItemAction } from "store/ytplaylist/listToPlayActions";
import { reorderPlaylistItemByPlaylistIdAction } from "store/ytplaylist/playlistActions";
import { reorderVideoItem } from "store/ytplaylist/videoActions";
import { ActionType } from "typesafe-actions";
import { isFiltering } from "utils/helper/generalHelper";
import { notify } from "utils/helper/notifyHelper";

/**
 * Detect whether the item is dragged from after
 * to before currently playing song.
 *
 * Note: the second condition, curSongIdx >= toIdx
 *       is important to ensure the item is dragged
 *       after to before current song, not just after
 *       to before without passing through current song
 *
 * @param curSongIdx
 * @param fromIdx
 * @param toIdx
 */
const isDraggedFromAfterToBeforeCurSong = (
  curSongIdx: number,
  fromIdx: number,
  toIdx: number
) => fromIdx > curSongIdx && curSongIdx >= toIdx;

/**
 * Detect whether the item is dragged from before
 * to after currently playing song.
 *
 * Note: the second condition, curSongIdx <= toIdx
 *       is important to ensure the item is dragged
 *       before to after current song, not just before
 *       to after without passing through current song
 *
 * @param curSongIdx
 * @param fromIdx
 * @param toIdx
 */
const isDraggedFromBeforeToAfterCurSong = (
  curSongIdx: number,
  fromIdx: number,
  toIdx: number
) => fromIdx < curSongIdx && curSongIdx <= toIdx;

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

      // disable drag n drop on filtering
      if (isFiltering(oriItemCount, curItemCount)) {
        notify("warning", "Please don't drag while filtering");
        return;
      }

      dispatch(reorderAction(fromIdx, toIdx));

      // if currently playing song is dragged
      if (fromIdx === curSongIdx) {
        dispatch(setCurSongIdx(toIdx));
      }

      // the two statements below ensure current song
      // is unchanged after reorder
      if (isDraggedFromBeforeToAfterCurSong(curSongIdx, fromIdx, toIdx)) {
        dispatch(setCurSongIdx(curSongIdx - 1));
      }

      if (isDraggedFromAfterToBeforeCurSong(curSongIdx, fromIdx, toIdx)) {
        dispatch(setCurSongIdx(curSongIdx + 1));
      }
    },
    [oriItemCount, curSongIdx, dispatch, reorderAction]
  );

  return {
    handleOnDragEnd,
  };
};
