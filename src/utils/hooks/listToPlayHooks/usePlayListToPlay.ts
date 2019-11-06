import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { filterListToPlayItemsAction } from "store/ytplaylist/listToPlayActions";
import { selectListToPlayTotalItems } from "store/ytplaylist/listToPlaySelectors";

import { notifyEmptyPlaylistList } from "./utils";

/**
 * usePlayListToPlay returns a handler func which
 * play only checked items if checked is not empty.
 * Else it plays the entire original listToPlay
 *
 * @param checked Checked array (default to empty array)
 *
 */
export const usePlayListToPlay = (checked: string[] = []) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const itemsCount = useSelector(selectListToPlayTotalItems);

  const handlePlayListToPlay = useCallback(() => {
    if (itemsCount === 0) {
      notifyEmptyPlaylistList();
      return;
    }

    if (checked.length !== 0) {
      dispatch(filterListToPlayItemsAction(checked));
    }

    history.push("/player/ytplayer");
  }, [checked, dispatch, history, itemsCount]);

  return {
    handlePlayListToPlay,
  };
};
