import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { deletePlaylistItemsByIdAction } from "store/ytplaylist/playlistActions";

/**
 * Simple hooks that provide handler function to
 * delete playlist items based on playlistId and itemIds
 * provided
 *
 * @param playlistId PlaylistId that contains items to delete
 * @param itemIds ItemIds of items to delete
 * @returns Object containing handler function
 */
export const useDeletePlaylistItems = (
  playlistId: string,
  itemIds: string[]
) => {
  const dispatch = useDispatch();

  const handleDeletePlaylistItems = useCallback(() => {
    dispatch(deletePlaylistItemsByIdAction(playlistId, itemIds));
  }, [dispatch, itemIds, playlistId]);

  return {
    handleDeletePlaylistItems,
  };
};
