import React from "react";
import { useSelector } from "react-redux";
import { selectPlayingPlaylists } from "store/ytplaylist/selector";
import { Tooltip, IconButton } from "@material-ui/core";
import {
  PlayArrow as PlayArrowIcon,
  Shuffle as ShuffleIcon,
  Remove as RemoveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
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
  props: ManagementPlaylistsPanelGridItemBtnProps
) => {
  const { playlistId } = props;
  const playingPlaylists = useSelector(selectPlayingPlaylists);

  return (
    <div>
      <Tooltip title="Play">
        <IconButton>
          <PlayArrowIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Shuffle">
        <IconButton>
          <ShuffleIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      {playingPlaylists.includes(playlistId) ? (
        <Tooltip title="Remove Playlist from Now Playing">
          <IconButton>
            <RemoveIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add Playlist to Now Playing">
          <IconButton>
            <AddIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Delete">
        <IconButton>
          <DeleteIcon fontSize="large" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default ManagementPlaylistsPanelGridItemBtn;
