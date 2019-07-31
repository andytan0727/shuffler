import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Typography, Divider } from "@material-ui/core";
import {
  ManagementPanelVirtualList,
  makeManagementPanelVirtualListItem,
} from "components/Lists/ManagementPanelVirtualList";
import { useCheckbox } from "components/Checkbox/hooks";
import { createItemData } from "components/Lists/ManagementPanelVirtualList";
import { ManagementPanelCtrlBtnGroup } from "components/Buttons";
import {
  deleteNormPlaylistItemByIdAction,
  updateNormListToPlayAction,
  shuffleNormPlaylistItems,
} from "store/ytplaylist/normAction";
import {
  selectNormPlaylistItemIdsById,
  selectNormPlaylistNameById,
} from "store/ytplaylist/normSelector";

import styles from "./styles.module.scss";

interface ManagementPlaylistPanelProps extends RouteComponentProps {
  match: MatchRoute;
}

const ManagementPanelVirtualListPlaylistItem = makeManagementPanelVirtualListItem(
  "playlists"
);

const ManagementPlaylistPanel = ({
  match,
  history,
}: ManagementPlaylistPanelProps) => {
  const playlistId: string = match.params.id;
  const dispatch = useDispatch();
  const playlistName = useSelector((state: never) =>
    selectNormPlaylistNameById(state, playlistId)
  );
  const playlistItemIds = useSelector((state: never) =>
    selectNormPlaylistItemIdsById(state, playlistId)
  ) as string[];
  const { checked, handleSetChecked } = useCheckbox();

  const playlistItemData = createItemData(
    checked,
    handleSetChecked,
    playlistItemIds
  );

  const handlePlayPlaylist = useCallback(() => {
    dispatch(updateNormListToPlayAction("playlists", playlistId, checked));

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
      <Typography variant="h4">
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
