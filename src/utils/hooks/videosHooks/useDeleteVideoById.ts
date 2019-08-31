import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { deleteVideoByIdAction } from "store/ytplaylist/videoActions";

/**
 * Simple hooks that provide handler function to
 * delete video from Redux states based
 * on the itemId supplied
 *
 * **Note: For videos, videoId === itemId === snippetId**
 *
 * @param itemId Video's itemId to be deleted
 * @returns Object containing handler function
 */
export const useDeleteVideoById = (itemId: string) => {
  const dispatch = useDispatch();

  const handleDeleteVideoById = useCallback(() => {
    dispatch(deleteVideoByIdAction(itemId));
  }, [dispatch, itemId]);

  return {
    handleDeleteVideoById,
  };
};
