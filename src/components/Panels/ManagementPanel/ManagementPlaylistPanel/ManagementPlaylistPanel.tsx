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
import { updateListToPlayAction } from "store/ytplaylist/listToPlayActions";
import {
  deletePlaylistItemByIdAction,
  shufflePlaylistItems,
} from "store/ytplaylist/playlistActions";
import {
  selectPlaylistItemIdsByPlaylistId,
  selectPlaylistNameById,
} from "store/ytplaylist/playlistSelectors";

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
    selectPlaylistNameById(state, playlistId)
  );
  const playlistItemIds = useSelector((state: AppState) =>
    selectPlaylistItemIdsByPlaylistId(state, playlistId)
  ) as string[];
  const checkboxHooks = useCheckbox();
  const { checked } = checkboxHooks;

  const playlistItemData = createItemData({
    ...checkboxHooks,
    items: playlistItemIds,
  });

  const handlePlayPlaylist = useCallback(() => {
    dispatch(
      updateListToPlayAction(
        "playlistItems",
        playlistId,
        checked.length === 0 ? playlistItemIds : checked
      )
    );

    history.push("/player/ytplayer");
  }, [checked, dispatch, history, playlistId, playlistItemIds]);

  const handleShufflePlaylist = useCallback(() => {
    dispatch(shufflePlaylistItems(playlistId));
  }, [playlistId, dispatch]);

  const handleDeletePlaylistItems = useCallback(() => {
    checked.forEach((itemId) => {
      dispatch(deletePlaylistItemByIdAction(playlistId, itemId));
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
