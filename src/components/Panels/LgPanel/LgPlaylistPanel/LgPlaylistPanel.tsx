import {
  LgPanelCtrlBtnGroup,
  RenamePlaylistBtn,
  SyncPlaylistBtn,
} from "components/Buttons";
import { FilterSnippetInput } from "components/Inputs";
import { LgPanelVirtualList } from "components/Lists/LgPanelVirtualList";
import SyncPlaylistLoader from "components/Loadings/SyncPlaylistLoader";
import React from "react";
import { useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
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
import { useDragPlaylistItem } from "utils/hooks/playlistsHooks/useDragPlaylistItem";

import { Divider, Typography } from "@material-ui/core";

import styles from "./styles.module.scss";

const LgPlaylistPanel: React.FC = () => {
  const {
    params: { id: playlistId },
  } = useRouteMatch();
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
    checked.length === 0 ? playlistItemIds : checked
  );
  const { handleShufflePlaylist } = useShufflePlaylist(playlistId);
  const { handleRenamePlaylist } = useRenamePlaylist(playlistId);
  const { handleDeletePlaylistItems } = useDeletePlaylistItems(
    playlistId,
    checked
  );
  const { handleSyncPlaylist } = useSyncPlaylist(playlistId);

  const { handleOnDragEnd } = useDragPlaylistItem(playlistId);

  return (
    <React.Fragment>
      <SyncPlaylistLoader open={updating} />
      <div className={styles.lgPlaylistPanelDiv}>
        <div className={styles.titleDiv}>
          <Typography variant="h4" className={styles.title}>
            {playlistName || `Playlist-${playlistId}`}
          </Typography>
          <RenamePlaylistBtn handleRename={handleRenamePlaylist} />
        </div>
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
          <SyncPlaylistBtn handleSyncPlaylist={handleSyncPlaylist} />
        </div>
        <Divider />
        <LgPanelVirtualList
          itemData={filteredItems}
          snippetType="pv"
          onDragEnd={handleOnDragEnd}
        />
      </div>
    </React.Fragment>
  );
};

export default LgPlaylistPanel;
