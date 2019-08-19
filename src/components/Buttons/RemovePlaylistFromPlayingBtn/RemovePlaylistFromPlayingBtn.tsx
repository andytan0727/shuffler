import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { removePlaylistFromListToPlayAction } from "store/ytplaylist/playlistActions";
import { notify } from "utils/helper/notifyHelper";

import { IconButton, Tooltip } from "@material-ui/core";
import { Remove as RemoveIcon } from "@material-ui/icons";

interface RemovePlaylistFromPlayingBtnProps {
  playlistId: string;
  iconSize?: "inherit" | "small" | "large" | "default" | undefined;
}

const RemovePlaylistFromPlayingBtn = (
  props: RemovePlaylistFromPlayingBtnProps
) => {
  const { playlistId, iconSize } = props;
  const dispatch = useDispatch();

  const handleRemovePlaylistAsPlaying = useCallback(() => {
    dispatch(removePlaylistFromListToPlayAction(playlistId));

    notify("success", "Removed playlist from Now Playing");
  }, [dispatch, playlistId]);

  return (
    <Tooltip title="Remove Playlist from Now Playing">
      <IconButton onClick={handleRemovePlaylistAsPlaying}>
        <RemoveIcon fontSize={iconSize} />
      </IconButton>
    </Tooltip>
  );
};

export default RemovePlaylistFromPlayingBtn;
