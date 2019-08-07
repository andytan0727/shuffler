import { ManagementPanelCtrlBtnGroup } from "components/Buttons";
import { useCheckbox } from "components/Checkbox/hooks";
import {
  createItemData,
  ListToPlayListItemSecondaryAction,
  ManagementPanelVirtualList,
  withListItemSecondaryAction,
} from "components/Lists/ManagementPanelVirtualList";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { deleteNormListToPlayItemsAction } from "store/ytplaylist/normAction";
import { selectAllNormListToPlayItemIds } from "store/ytplaylist/normSelector";
import { shuffleListToPlayAction } from "store/ytplaylist/sharedAction";

import { Divider, Typography } from "@material-ui/core";

import styles from "./styles.module.scss";

type ManagementNowPlayingPanelProps = RouteComponentProps;

const ManagementPanelVirtualListToPlayItem = withListItemSecondaryAction(
  ListToPlayListItemSecondaryAction
);

const ManagementNowPlayingPanel = (props: ManagementNowPlayingPanelProps) => {
  const { history } = props;
  const dispatch = useDispatch();
  const listToPlayItemIds = useSelector(selectAllNormListToPlayItemIds);
  const { checked, handleSetChecked } = useCheckbox();
  const listToPlayItemData = createItemData(
    checked,
    handleSetChecked,
    listToPlayItemIds
  );

  const handlePlayListToPlay = useCallback(() => {
    history.push("/player/ytplayer");
  }, [history]);

  const handleShuffleListToPlay = useCallback(() => {
    dispatch(shuffleListToPlayAction());
  }, [dispatch]);

  // delete listToPlay items without deleting original items from playlists/videos
  const handleDeleteListToPlayItems = useCallback(() => {
    dispatch(deleteNormListToPlayItemsAction(checked));
  }, [dispatch, checked]);

  return (
    <div className={styles.managementNowPlayingPanelDiv}>
      <Typography variant="h4">Now Playing</Typography>
      <ManagementPanelCtrlBtnGroup
        handlePlay={handlePlayListToPlay}
        handleShuffle={handleShuffleListToPlay}
        handleDelete={handleDeleteListToPlayItems}
      />
      <Divider />
      <ManagementPanelVirtualList itemData={listToPlayItemData}>
        {ManagementPanelVirtualListToPlayItem}
      </ManagementPanelVirtualList>
    </div>
  );
};

export default withRouter(ManagementNowPlayingPanel);
