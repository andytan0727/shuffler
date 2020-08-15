import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "store";
import { updatePlaylistNameByIdAction } from "store/ytplaylist/playlistActions";
import { selectPlaylistNameById } from "store/ytplaylist/playlistSelectors";
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
  const curPlaylistName = useSelector((state: AppState) =>
    selectPlaylistNameById(state, playlistId)
  );

  const handleRenamePlaylist = useCallback(async () => {
    const customSwal = await generateCustomSwal();
    const result = await customSwal!.fire({
      title: "Enter new playlist name",
      icon: "info",
      input: "text",
      inputValue: curPlaylistName || `Playlist-${playlistId}`,
      showCancelButton: true,
      confirmButtonText: "Ok 🔥",
      cancelButtonText: "Cancel",
    });
    const newName = result.value;

    if (newName) {
      dispatch(updatePlaylistNameByIdAction(playlistId, newName));
      notify("success", "Successfully renamed playlist 😎");
    }
  }, [curPlaylistName, dispatch, playlistId]);

  return {
    handleRenamePlaylist,
  };
};
