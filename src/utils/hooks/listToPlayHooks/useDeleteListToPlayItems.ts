import { ClearChecked } from "components/Checkbox/hooks";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { deleteListToPlayItemsAction } from "store/ytplaylist/listToPlayActions";

/**
 * useDeleteListToPlayItems returns a handle func that
 * delete listToPlay items without deleting original items from playlists/videos
 *
 * @param checked Checked items array
 * @param clearChecked Function to clear the given checked array
 */
export const useDeleteListToPlayItems = (
  checked: string[],
  clearChecked: ClearChecked
) => {
  const dispatch = useDispatch();

  const handleDeleteListToPlayItems = useCallback(() => {
    dispatch(deleteListToPlayItemsAction(checked));

    // clear all checked videos after deletion
    clearChecked();
  }, [dispatch, checked, clearChecked]);

  return {
    handleDeleteListToPlayItems,
  };
};
