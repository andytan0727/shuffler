import { ManagementPanelCtrlBtnGroup } from "components/Buttons";
import { useCheckbox } from "components/Checkbox/hooks";
import {
  createItemData,
  ManagementPanelVirtualList,
  PlaylistVideoListItemSecondaryAction,
  withListItemSecondaryAction,
} from "components/Lists/ManagementPanelVirtualList";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { AppState } from "store";
import { updateNormListToPlayAction } from "store/ytplaylist/listToPlayActions";
import {
  selectNormPlaylistItemIdsByPlaylistId,
  selectNormPlaylistNameById,
} from "store/ytplaylist/normSelector";
import {
  deleteNormPlaylistItemByIdAction,
  shuffleNormPlaylistItems,
} from "store/ytplaylist/playlistActions";

import { Divider, Typography } from "@material-ui/core";

import styles from "./styles.module.scss";

interface ManagementPlaylistPanelProps extends RouteComponentProps {
  match: MatchRoute;
}

const ManagementPanelVirtualListPlaylistItem = withListItemSecondaryAction(
  PlaylistVideoListItemSecondaryAction
);

const ManagementPlaylistPanel = ({
  match,
  history,
}: ManagementPlaylistPanelProps) => {
  const playlistId: string = match.params.id;
  const dispatch = useDispatch();
  const playlistName = useSelector((state: AppState) =>
    selectNormPlaylistNameById(state, playlistId)
  );
  const playlistItemIds = useSelector((state: AppState) =>
    selectNormPlaylistItemIdsByPlaylistId(state, playlistId)
  ) as string[];
  const { checked, handleSetChecked } = useCheckbox();

  const playlistItemData = createItemData(
    checked,
    handleSetChecked,
    playlistItemIds
  );

  const handlePlayPlaylist = useCallback(() => {
    if (checked.length !== 0) {
      dispatch(
        updateNormListToPlayAction("playlistItems", playlistId, checked)
      );
    }

    history.push("/player/ytplayer");
  }, [history, dispatch, playlistId, checked]);

  const handleShufflePlaylist = useCallback(() => {
    dispatch(shuffleNormPlaylistItems(playlistId));
  }, [playlistId, dispatch]);

  const handleDeletePlaylistItems = useCallback(() => {
    checked.forEach((itemId) => {
      dispatch(deleteNormPlaylistItemByIdAction(playlistId, itemId));
    });
  }, [checked, dispatch, playlistId]);

  return (
    <div className={styles.managementPlaylistPanelDiv}>
      <Typography variant="h4" className={styles.title}>
        Playlist {playlistName || playlistId}
      </Typography>
      <ManagementPanelCtrlBtnGroup
        handlePlay={handlePlayPlaylist}
        handleShuffle={handleShufflePlaylist}
        handleDelete={handleDeletePlaylistItems}
      />
      <Divider />
      <ManagementPanelVirtualList itemData={playlistItemData}>
        {ManagementPanelVirtualListPlaylistItem}
      </ManagementPanelVirtualList>
    </div>
  );
};

export default withRouter(ManagementPlaylistPanel);
