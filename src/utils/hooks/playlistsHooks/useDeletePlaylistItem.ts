import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "store";
import { deletePlaylistItemByIdAction } from "store/ytplaylist/playlistActions";
import { selectPlaylistIdByItemId } from "store/ytplaylist/playlistSelectors";
import { notify } from "utils/helper/notifyHelper";

/**
 * Simple hooks that provide handler function to
 * delete playlist item from Redux states based
 * on the itemId supplied
 *
 * @param itemId ItemId of the corresponding playlist time to be deleted
 * @returns Object containing handler function and playlistId
 */
export const useDeletePlaylistItem = (itemId: string) => {
  const playlistId = useSelector((state: AppState) =>
    selectPlaylistIdByItemId(state, itemId)
  );
  const dispatch = useDispatch();

  const handleDeletePlaylistItem = useCallback(() => {
    // warn user if playlist could not be found
    // then cease execution
    if (!playlistId) {
      notify(
        "warning",
        "Playlist associated with this item could not be found"
      );
      return;
    }

    dispatch(deletePlaylistItemByIdAction(playlistId, itemId));
  }, [dispatch, itemId, playlistId]);

  return {
    handleDeletePlaylistItem,

    // playlistId of the corresponded playlistItem
    // recommended to access only when needed
    playlistId,
  };
};
