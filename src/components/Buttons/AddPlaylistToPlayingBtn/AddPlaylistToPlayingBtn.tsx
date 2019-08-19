import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { addPlaylistToListToPlayAction } from "store/ytplaylist/playlistActions";
import { notify } from "utils/helper/notifyHelper";

import { IconButton, Tooltip } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";

interface AddPlaylistToPlayingBtnProps {
  playlistId: string;
  iconSize?: "inherit" | "small" | "large" | "default" | undefined;
}

const AddPlaylistToPlayingBtn = (props: AddPlaylistToPlayingBtnProps) => {
  const { playlistId, iconSize } = props;
  const dispatch = useDispatch();

  const handleAddPlaylistAsPlaying = useCallback(() => {
    dispatch(addPlaylistToListToPlayAction(playlistId));

    notify("success", "Added playlist to Now Playing");
  }, [dispatch, playlistId]);

  return (
    <Tooltip title="Add Playlist to Now Playing">
      <IconButton onClick={handleAddPlaylistAsPlaying}>
        <AddIcon fontSize={iconSize} />
      </IconButton>
    </Tooltip>
  );
};

export default AddPlaylistToPlayingBtn;
