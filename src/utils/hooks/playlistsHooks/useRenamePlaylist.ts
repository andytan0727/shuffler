import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { updatePlaylistNameByIdAction } from "store/ytplaylist/playlistActions";
import { generateCustomSwal, notify } from "utils/helper/notifyHelper";

/**
 * Hooks to rename playlist based on playlistId provided.
 * If success, notify user with the success message
 *
 * @param playlistId PlaylistId of playlist to rename
 * @returns Object containing handler function
 */
export const useRenamePlaylist = (playlistId: string) => {
  const dispatch = useDispatch();

  const handleRenamePlaylist = useCallback(async () => {
    const customSwal = await generateCustomSwal();
    const result = await customSwal!.fire({
      title: "Enter new playlist name",
      input: "text",
      showCancelButton: true,
      confirmButtonText: "Ok, Done! 🔥",
      cancelButtonText: "Cancel",
    });
    const newName = result.value;

    if (newName) {
      dispatch(updatePlaylistNameByIdAction(playlistId, newName));
      notify("success", "Successfully renamed playlist 😎");
    }
  }, [dispatch, playlistId]);

  return {
    handleRenamePlaylist,
  };
};
