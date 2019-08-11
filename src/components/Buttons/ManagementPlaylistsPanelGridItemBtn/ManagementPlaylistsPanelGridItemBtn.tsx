import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { AppState } from "store";
import {
  addNormPlaylistToNormListToPlayAction,
  deleteNormPlaylistByIdAction,
  removeNormPlaylistFromNormListToPlayAction,
  shuffleNormPlaylistItems,
  updateNormListToPlayAction,
} from "store/ytplaylist/normAction";
import { selectNormPlaylistById } from "store/ytplaylist/normSelector";
import { notify } from "utils/helper/notifyHelper";

import { IconButton, Tooltip } from "@material-ui/core";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Remove as RemoveIcon,
  Shuffle as ShuffleIcon,
} from "@material-ui/icons";

interface ManagementPlaylistsPanelGridItemBtnProps {
  playlistId: string;
}

/**
 * ManagementPlaylistsPanelGridItemBtn component
 *
 * Button group for grid item
 *
 */
const ManagementPlaylistsPanelGridItemBtn = (
  props: ManagementPlaylistsPanelGridItemBtnProps & RouteComponentProps
) => {
  const { playlistId, history } = props;
  const dispatch = useDispatch();
  const playlist = useSelector((state: AppState) =>
    selectNormPlaylistById(state, playlistId)
  );
  const playlistInPlaying = !!(playlist && playlist.allInPlaying);
  const itemIds = playlist.items;

  const handlePlayPlaylist = useCallback(() => {
    // play whole playlist
    dispatch(
      updateNormListToPlayAction("playlists", playlistId, itemIds as string[])
    );

    history.push("/player/ytplayer");
  }, [dispatch, playlistId, itemIds, history]);

  const handleShufflePlaylist = useCallback(() => {
    dispatch(shuffleNormPlaylistItems(playlistId));

    notify("info", `Shuffling ...`);
  }, [dispatch, playlistId]);

  const handleAddPlaylistAsPlaying = useCallback(() => {
    dispatch(addNormPlaylistToNormListToPlayAction(playlistId));
  }, [dispatch, playlistId]);

  const handleRemovePlaylistAsPlaying = useCallback(() => {
    dispatch(
      removeNormPlaylistFromNormListToPlayAction(
        playlistId,
        itemIds as string[]
      )
    );
  }, [dispatch, playlistId, itemIds]);

  const handleDeletePlaylist = useCallback(() => {
    dispatch(deleteNormPlaylistByIdAction(playlistId));
  }, [dispatch, playlistId]);

  return (
    <div>
      <Tooltip title="Play">
        <IconButton onClick={handlePlayPlaylist}>
          <PlayArrowIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Shuffle">
        <IconButton onClick={handleShufflePlaylist}>
          <ShuffleIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      {playlistInPlaying ? (
        <Tooltip title="Remove Playlist from Now Playing">
          <IconButton onClick={handleRemovePlaylistAsPlaying}>
            <RemoveIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add Playlist to Now Playing">
          <IconButton onClick={handleAddPlaylistAsPlaying}>
            <AddIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Delete">
        <IconButton onClick={handleDeletePlaylist}>
          <DeleteIcon fontSize="large" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default withRouter(ManagementPlaylistsPanelGridItemBtn);
