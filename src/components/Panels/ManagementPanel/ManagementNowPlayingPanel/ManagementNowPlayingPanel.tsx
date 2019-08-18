import { ManagementFilterAndCtrlBar } from "components/Bars";
import { useCheckbox } from "components/Checkbox/hooks";
import {
  createItemData,
  ListToPlayListItemSecondaryAction,
  ManagementPanelVirtualList,
  withListItemSecondaryAction,
} from "components/Lists/ManagementPanelVirtualList";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { clearFilteredSnippets } from "store/ytplaylist/filteredActions";
import { selectFilteredSnippets } from "store/ytplaylist/filteredSelectors";
import {
  deleteNormListToPlayItemsAction,
  filterListToPlayItemsAction,
  shuffleListToPlayAction,
} from "store/ytplaylist/listToPlayActions";
import { selectAllNormListToPlayItemIds } from "store/ytplaylist/listToPlaySelectors";

import { Divider, Typography } from "@material-ui/core";

import styles from "./styles.module.scss";

type ManagementNowPlayingPanelProps = RouteComponentProps;

const ManagementPanelVirtualListToPlayItem = withListItemSecondaryAction(
  ListToPlayListItemSecondaryAction
);

const ManagementNowPlayingPanel = (props: ManagementNowPlayingPanelProps) => {
  const { history } = props;
  const filteredSnippets = useSelector(selectFilteredSnippets);
  const dispatch = useDispatch();
  const listToPlayItemIds = useSelector(selectAllNormListToPlayItemIds);
  const checkboxHooks = useCheckbox();
  const { checked, clearChecked } = checkboxHooks;

  // allow filtered snippets to be shown on list item
  // for details please refer to
  // ManagementPanelVirtualList/ ManagementPanelVirtualListItem
  const listToPlayItemData = createItemData({
    ...checkboxHooks,
    items: listToPlayItemIds,
    filteredSnippets,
  });

  // play only checked items if checked is not empty
  // else play the entire original listToPlay
  const handlePlayListToPlay = useCallback(() => {
    if (checked.length !== 0) {
      dispatch(filterListToPlayItemsAction(checked));
    }

    history.push("/player/ytplayer");
  }, [dispatch, checked, history]);

  // shuffle listToPlay with items' position in checked array remain constant
  // if checked array is empty, normal old shuffle is executed instead
  const handleShuffleListToPlay = useCallback(() => {
    dispatch(
      shuffleListToPlayAction(checked.length !== 0 ? checked : undefined)
    );
  }, [checked, dispatch]);

  // delete listToPlay items without deleting original items from playlists/videos
  const handleDeleteListToPlayItems = useCallback(() => {
    dispatch(deleteNormListToPlayItemsAction(checked));

    // clear all checked videos after deletion
    clearChecked();
  }, [dispatch, checked, clearChecked]);

  // clear filtered result if user is leaving now playing panel
  useEffect(() => {
    return () => {
      dispatch(clearFilteredSnippets());
    };
  }, [dispatch]);

  return (
    <div className={styles.managementNowPlayingPanelDiv}>
      <Typography variant="h4">Now Playing</Typography>
      <ManagementFilterAndCtrlBar
        itemIds={listToPlayItemIds}
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
