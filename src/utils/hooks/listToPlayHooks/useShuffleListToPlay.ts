import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { shuffleListToPlayAction } from "store/ytplaylist/listToPlayActions";
import { selectListToPlayTotalItems } from "store/ytplaylist/listToPlaySelectors";

import { notifyEmptyPlaylistList } from "./utils";

/**
 * useShuffleListToPlay returns a handler func which
 * shuffle listToPlay with items' position in checked array remain consistent.
 *
 * If checked array is empty, normal old shuffle is executed instead.
 *
 * NOTE: checked array with length 0 must be treated
 *       as undefined in shuffleListToPlayAction
 *
 * @param checked Checked items array (default to empty array)
 *
 */
export const useShuffleListToPlay = (checked: string[] = []) => {
  const dispatch = useDispatch();
  const itemsCount = useSelector(selectListToPlayTotalItems);

  const handleShuffleListToPlay = useCallback(() => {
    if (itemsCount === 0) {
      notifyEmptyPlaylistList();
      return;
    }

    dispatch(
      shuffleListToPlayAction(checked.length !== 0 ? checked : undefined)
    );
  }, [checked, dispatch, itemsCount]);

  return {
    handleShuffleListToPlay,
  };
};
