import {
  AddPlaylistToPlayingBtn,
  RemovePlaylistFromPlayingBtn,
} from "components/Buttons";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "store";
import { selectPlaylistById } from "store/ytplaylist/playlistSelectors";
import {
  useDeletePlaylist,
  usePlayPlaylist,
  useShufflePlaylist,
} from "utils/hooks/playlistsHooks";

import { IconButton, Tooltip } from "@material-ui/core";
import {
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Shuffle as ShuffleIcon,
} from "@material-ui/icons";

interface LgPlaylistsPanelGridItemBtnProps {
  playlistId: string;
}

/**
 * LgPlaylistsPanelGridItemBtn component
 *
 * Button group for grid item
 *
 */
export const LgPlaylistsPanelGridItemBtn: React.FC<LgPlaylistsPanelGridItemBtnProps> = (
  props: LgPlaylistsPanelGridItemBtnProps
) => {
  const { playlistId } = props;
  const playlist = useSelector((state: AppState) =>
    selectPlaylistById(state, playlistId)
  );
  const itemIds = playlist && playlist.items;
  const playlistInPlaying = !!(playlist && playlist.allInPlaying);

  const { handleShufflePlaylist } = useShufflePlaylist(playlistId);
  const { handlePlayPlaylist } = usePlayPlaylist(
    playlistId,
    itemIds as string[]
  );
  const { handleDeletePlaylist } = useDeletePlaylist([playlistId]);

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

export default LgPlaylistsPanelGridItemBtn;
