import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { shufflePlaylistItems } from "store/ytplaylist/playlistActions";
import { notify } from "utils/helper/notifyHelper";

/**
 * Simple hooks that provide handler function to
 * shuffle playlist with playlistId given
 *
 * @param playlistId Playlist id of playlist to shuffle
 * @returns Object containing handler function
 */
export const useShufflePlaylist = (playlistId: string) => {
  const dispatch = useDispatch();

  const handleShufflePlaylist = useCallback(() => {
    dispatch(shufflePlaylistItems(playlistId));

    notify("info", `Shuffling ...`);
  }, [dispatch, playlistId]);

  return {
    handleShufflePlaylist,
  };
};
