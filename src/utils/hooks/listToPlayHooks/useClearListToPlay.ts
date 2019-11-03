import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearListToPlayAction } from "store/ytplaylist/listToPlayActions";
import { selectListToPlayTotalItems } from "store/ytplaylist/listToPlaySelectors";

import { notifyEmptyPlaylistList } from "./utils";

/**
 * useClearListToPlay returns a handler func to clear
 * listToPlay items.
 * Alert user if they attempted to clear an empty listToPlay
 *
 */
export const useClearListToPlay = () => {
  const dispatch = useDispatch();
  const itemsCount = useSelector(selectListToPlayTotalItems);

  const handleClearListToPlay = useCallback(() => {
    if (itemsCount === 0) {
      notifyEmptyPlaylistList();
      return;
    }

    dispatch(clearListToPlayAction());
  }, [dispatch, itemsCount]);

  return {
    handleClearListToPlay,
  };
};
