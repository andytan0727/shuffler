import partial from "lodash/partial";
import { useSelector } from "react-redux";
import { AppState } from "store";
import { reorderPlaylistItemByPlaylistIdAction } from "store/ytplaylist/playlistActions";
import { selectPlaylistItemCountByPlaylistId } from "store/ytplaylist/playlistSelectors";

import { useOnDragEnd } from "../shared/useOnDragEnd";

export const useDragPlaylistItem = (playlistId: string) => {
  const playlistItemCount = useSelector((state: AppState) =>
    selectPlaylistItemCountByPlaylistId(state, playlistId)
  );
  const { handleOnDragEnd } = useOnDragEnd(
    playlistItemCount,
    partial(reorderPlaylistItemByPlaylistIdAction, playlistId)
  );

  return {
    handleOnDragEnd,
  };
};
