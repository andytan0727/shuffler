import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { updateListToPlayAction } from "store/ytplaylist/listToPlayActions";

/**
 * Simple hooks that provide handler function to
 * play playlist items based on playlistId and itemIds
 * provided
 *
 * @param playlistId PlaylistId of playlist to play
 * @param itemIds ItemIds of items in the playlist to play
 * @returns Object containing handler function
 */
export const usePlayPlaylist = (playlistId: string, itemIds: string[]) => {
  const dispatch = useDispatch();
  const history = useHistory();

  /**
   * Update (replace) entire listToPlay with items from
   * this playlist. Then it uses history object from
   * react-router to redirect user to /player/ytplayer page
   *
   */
  const handlePlayPlaylist = useCallback(() => {
    dispatch(
      updateListToPlayAction("playlistItems", playlistId, itemIds as string[])
    );

    history.push("/player/ytplayer");
  }, [dispatch, history, itemIds, playlistId]);

  return { handlePlayPlaylist };
};
