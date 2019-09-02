import { History } from "history";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { updateListToPlayAction } from "store/ytplaylist/listToPlayActions";

/**
 * Simple hooks that provide handler function to
 * play playlist items based on playlistId and itemIds
 * provided
 *
 * @param playlistId PlaylistId of playlist to play
 * @param itemIds ItemIds of items in the playlist to play
 * @param history History object from react-router (particularly from withRouter)
 * @returns Object containing handler function
 */
export const usePlayPlaylist = (
  playlistId: string,
  itemIds: string[],
  history: History
) => {
  const dispatch = useDispatch();

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
