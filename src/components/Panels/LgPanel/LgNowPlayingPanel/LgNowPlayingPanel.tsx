import { FilterAndCtrlBar } from "components/Bars";
import { ClearNowPlayingBtn } from "components/Buttons";
import { useCheckbox } from "components/Checkbox/hooks";
import {
  createItemData,
  LgPanelVirtualList,
  ListToPlayListItemSecondaryAction,
  withListItemSecondaryAction,
} from "components/Lists/LgPanelVirtualList";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { selectFilteredSnippets } from "store/ytplaylist/filteredSelectors";
import {
  clearListToPlayAction,
  deleteListToPlayItemsAction,
  filterListToPlayItemsAction,
  shuffleListToPlayAction,
} from "store/ytplaylist/listToPlayActions";
import {
  selectAllListToPlayItemIds,
  selectListToPlayTotalItems,
} from "store/ytplaylist/listToPlaySelectors";
import { notify } from "utils/helper/notifyHelper";

import { Divider, Typography } from "@material-ui/core";

import styles from "./styles.module.scss";

type LgNowPlayingPanelProps = RouteComponentProps;

const LgPanelVirtualListToPlayItem = withListItemSecondaryAction(
  ListToPlayListItemSecondaryAction
);

const LgNowPlayingPanel = (props: LgNowPlayingPanelProps) => {
  const { history } = props;
  const filteredSnippets = useSelector(selectFilteredSnippets);
  const dispatch = useDispatch();
  const listToPlayItemIds = useSelector(selectAllListToPlayItemIds);
  const itemsCount = useSelector(selectListToPlayTotalItems);
  const checkboxHooks = useCheckbox();
  const { checked, clearChecked } = checkboxHooks;

  // allow filtered snippets to be shown on list item
  // for details please refer to
  // LgPanelVirtualList/ LgPanelVirtualListItem
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
    dispatch(deleteListToPlayItemsAction(checked));

    // clear all checked videos after deletion
    clearChecked();
  }, [dispatch, checked, clearChecked]);

  // clear listToPlay items
  // alert user if they attempted to clear an empty listToPlay
  const handleClearNowPlaying = useCallback(() => {
    if (itemsCount === 0) {
      notify("warning", "Now playing is empty");
      return;
    }

    dispatch(clearListToPlayAction());
  }, [dispatch, itemsCount]);

  return (
    <div className={styles.lgNowPlayingPanelDiv}>
      <Typography variant="h4">Now Playing</Typography>
      <div className={styles.ctrlPanelDiv}>
        <FilterAndCtrlBar
          itemIds={listToPlayItemIds}
          handlePlay={handlePlayListToPlay}
          handleShuffle={handleShuffleListToPlay}
          handleDelete={handleDeleteListToPlayItems}
        />
        <ClearNowPlayingBtn handleClearNowPlaying={handleClearNowPlaying} />
      </div>

      <Divider />
      <LgPanelVirtualList itemData={listToPlayItemData}>
        {LgPanelVirtualListToPlayItem}
      </LgPanelVirtualList>
    </div>
  );
};

export default withRouter(LgNowPlayingPanel);
