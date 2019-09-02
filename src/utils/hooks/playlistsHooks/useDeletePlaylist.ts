import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { deletePlaylistByIdAction } from "store/ytplaylist/playlistActions";
import {
  generateCustomSwal,
  noPlaylistProvidedAlert,
  notify,
} from "utils/helper/notifyHelper";

/**
 * Simple hooks that provide handler function to
 * delete playlist(s) based on playlistIds array
 * provided
 *
 * @param playlistIds PlaylistIds of playlists to delete
 * @returns Object containing handler function
 */
export const useDeletePlaylist = (playlistIds: string[]) => {
  const dispatch = useDispatch();

  const handleDeletePlaylist = useCallback(async () => {
    const customSwal = await generateCustomSwal();

    if (!playlistIds.length) {
      await noPlaylistProvidedAlert();
      return;
    }

    const result = await customSwal!.fire({
      title: "Remove playlist",
      text: "Are you sure?🤔",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it please!🔥",
      cancelButtonText: "No!!!😱",
    });

    if (result.value) {
      playlistIds.forEach((playlistId) => {
        dispatch(deletePlaylistByIdAction(playlistId));
      });

      notify("success", "Successfully deleted playlist(s) 😎");
    }
  }, [dispatch, playlistIds]);

  return {
    handleDeletePlaylist,
  };
};
