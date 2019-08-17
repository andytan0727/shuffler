import {
  AddPlaylistToPlayingBtn,
  RemovePlaylistFromPlayingBtn,
} from "components/Buttons";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { AppState } from "store";
import { updateNormListToPlayAction } from "store/ytplaylist/listToPlayActions";
import {
  deleteNormPlaylistByIdAction,
  shuffleNormPlaylistItems,
} from "store/ytplaylist/playlistActions";
import { selectNormPlaylistById } from "store/ytplaylist/playlistSelectors";
import { notify } from "utils/helper/notifyHelper";

import { IconButton, Tooltip } from "@material-ui/core";
import {
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
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
      updateNormListToPlayAction(
        "playlistItems",
        playlistId,
        itemIds as string[]
      )
    );

    history.push("/player/ytplayer");
  }, [dispatch, history, itemIds, playlistId]);

  const handleShufflePlaylist = useCallback(() => {
    dispatch(shuffleNormPlaylistItems(playlistId));

    notify("info", `Shuffling ...`);
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
        <RemovePlaylistFromPlayingBtn
          playlistId={playlistId}
          iconSize="large"
        />
      ) : (
        <AddPlaylistToPlayingBtn playlistId={playlistId} iconSize="large" />
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
