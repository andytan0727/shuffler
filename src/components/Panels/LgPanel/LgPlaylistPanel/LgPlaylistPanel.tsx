import {
  LgPanelCtrlBtnGroup,
  RenamePlaylistBtn,
  SyncPlaylistBtn,
} from "components/Buttons";
import { FilterSnippetInput } from "components/Inputs";
import {
  LgPanelVirtualList,
  PlaylistVideoListItemSecondaryAction,
  withListItemSecondaryAction,
} from "components/Lists/LgPanelVirtualList";
import SyncPlaylistLoader from "components/Loadings/SyncPlaylistLoader";
import React from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { AppState } from "store";
import {
  selectPlaylistItemIdsByPlaylistId,
  selectPlaylistNameById,
  selectPlaylistUpdating,
} from "store/ytplaylist/playlistSelectors";
import { useShowFilteredItems } from "utils/hooks/filteredHooks";
import {
  useDeletePlaylistItems,
  usePlayPlaylist,
  useRenamePlaylist,
  useShufflePlaylist,
  useSyncPlaylist,
} from "utils/hooks/playlistsHooks";

import { Divider, Typography } from "@material-ui/core";

import styles from "./styles.module.scss";

interface LgPlaylistPanelProps extends RouteComponentProps {
  match: MatchRoute;
}

const LgPanelVirtualListPlaylistItem = withListItemSecondaryAction(
  PlaylistVideoListItemSecondaryAction
);

const LgPlaylistPanel = ({ match, history }: LgPlaylistPanelProps) => {
  const playlistId: string = match.params.id;
  const playlistName = useSelector((state: AppState) =>
    selectPlaylistNameById(state, playlistId)
  );
  const updating = useSelector(selectPlaylistUpdating);
  const playlistItemIds = useSelector((state: AppState) =>
    selectPlaylistItemIdsByPlaylistId(state, playlistId)
  ) as string[];
  const { checked, filteredItems } = useShowFilteredItems(playlistItemIds);

  const { handlePlayPlaylist } = usePlayPlaylist(
    playlistId,
    checked.length === 0 ? playlistItemIds : checked,
    history
  );
  const { handleShufflePlaylist } = useShufflePlaylist(playlistId);
  const { handleRenamePlaylist } = useRenamePlaylist(playlistId);
  const { handleDeletePlaylistItems } = useDeletePlaylistItems(
    playlistId,
    checked
  );
  const { handleSyncPlaylist } = useSyncPlaylist(playlistId);

  return (
    <React.Fragment>
      <SyncPlaylistLoader open={updating} />
      <div className={styles.lgPlaylistPanelDiv}>
        <Typography variant="h4" className={styles.title}>
          {playlistName || `Playlist-${playlistId}`}
        </Typography>
        <div className={styles.ctrlPanelDiv}>
          <FilterSnippetInput
            itemIds={playlistItemIds}
            uniqueIdentifier={playlistId}
          />
          <LgPanelCtrlBtnGroup
            handlePlay={handlePlayPlaylist}
            handleShuffle={handleShufflePlaylist}
            handleDelete={handleDeletePlaylistItems}
          />
          <RenamePlaylistBtn handleRename={handleRenamePlaylist} />
          <SyncPlaylistBtn handleSyncPlaylist={handleSyncPlaylist} />
        </div>
        <Divider />
        <LgPanelVirtualList itemData={filteredItems}>
          {LgPanelVirtualListPlaylistItem}
        </LgPanelVirtualList>
      </div>
    </React.Fragment>
  );
};

export default withRouter(LgPlaylistPanel);
