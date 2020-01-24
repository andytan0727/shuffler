import { DeleteItemBtn } from "components/Buttons";
import { makeToggleItemToListToPlaySwitch } from "components/Switches";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { AppState } from "store";
import { selectSnippetByItemId } from "store/ytplaylist/generalSelectors";
import { isPlaylistItemSnippet } from "store/ytplaylist/utils";
import { useDeletePlaylistItem } from "utils/hooks/playlistsHooks";
import { useDeleteVideoById } from "utils/hooks/videosHooks";

export interface PlaylistVideoListItemSecondaryActionProps {
  itemId: string;
}

const PlaylistVideoListItemSecondaryAction = (
  props: PlaylistVideoListItemSecondaryActionProps
) => {
  const { itemId } = props;
  const snippet = useSelector((state: AppState) =>
    selectSnippetByItemId(state, itemId)
  );
  const { handleDeletePlaylistItem } = useDeletePlaylistItem(itemId);
  const { handleDeleteVideoById } = useDeleteVideoById(itemId);

  // Switch component which depends on the sourceType
  const ToggleItemToListToPlaySwitch = useMemo(
    () =>
      makeToggleItemToListToPlaySwitch(
        isPlaylistItemSnippet(snippet) ? "playlists" : "videos"
      ),
    [snippet]
  );

  return (
    <div>
      <ToggleItemToListToPlaySwitch itemId={itemId} />
      <DeleteItemBtn
        handleOnClick={
          isPlaylistItemSnippet(snippet)
            ? handleDeletePlaylistItem
            : handleDeleteVideoById
        }
      />
    </div>
  );
};

export default PlaylistVideoListItemSecondaryAction;
