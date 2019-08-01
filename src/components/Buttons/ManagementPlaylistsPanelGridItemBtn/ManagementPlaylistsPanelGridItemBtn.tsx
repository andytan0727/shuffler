import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Tooltip, IconButton } from "@material-ui/core";
import {
  PlayArrow as PlayArrowIcon,
  Shuffle as ShuffleIcon,
  Remove as RemoveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";
import { selectNormPlaylistById } from "store/ytplaylist/normSelector";
import {
  updateNormListToPlayAction,
  shuffleNormPlaylistItems,
  labelNormPlaylistAsPlayingByIdAction,
  removeNormPlaylistAsPlayingById,
  deleteNormPlaylistByIdAction,
} from "store/ytplaylist/normAction";
import { notify } from "utils/helper/notifyHelper";

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
  const playlist = useSelector((state: never) =>
    selectNormPlaylistById(state, playlistId)
  );
  const playlistInPlaying = !!(playlist && playlist.allInPlaying);

  const handlePlayPlaylist = useCallback(() => {
    // play whole playlist
    dispatch(
      updateNormListToPlayAction(
        "playlists",
        playlistId,
        playlist.items as string[]
      )
    );

    history.push("/player/ytplayer");
  }, [dispatch, playlistId, playlist, history]);

  const handleShufflePlaylist = useCallback(() => {
    dispatch(shuffleNormPlaylistItems(playlistId));

    notify("info", `Shuffling ...`);
  }, [dispatch, playlistId]);

  const handleAddPlaylistAsPlaying = useCallback(() => {
    dispatch(labelNormPlaylistAsPlayingByIdAction(playlistId));
  }, [dispatch, playlistId]);

  const handleRemovePlaylistAsPlaying = useCallback(() => {
    dispatch(removeNormPlaylistAsPlayingById(playlistId));
  }, [dispatch, playlistId]);

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
