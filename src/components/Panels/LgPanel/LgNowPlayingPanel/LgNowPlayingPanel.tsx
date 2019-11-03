import { FilterAndCtrlBar } from "components/Bars";
import { ClearNowPlayingBtn } from "components/Buttons";
import { useCheckbox } from "components/Checkbox/hooks";
import {
  createItemData,
  LgPanelVirtualList,
  ListToPlayListItemSecondaryAction,
  withListItemSecondaryAction,
} from "components/Lists/LgPanelVirtualList";
import React from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { selectFilteredSnippets } from "store/ytplaylist/filteredSelectors";
import { selectAllListToPlayItemIds } from "store/ytplaylist/listToPlaySelectors";
import {
  useClearListToPlay,
  useDeleteListToPlayItems,
  usePlayListToPlay,
  useShuffleListToPlay,
} from "utils/hooks/listToPlayHooks";

import { Divider, Typography } from "@material-ui/core";

import styles from "./styles.module.scss";

type LgNowPlayingPanelProps = RouteComponentProps;

const LgPanelVirtualListToPlayItem = withListItemSecondaryAction(
  ListToPlayListItemSecondaryAction
);

const LgNowPlayingPanel = (props: LgNowPlayingPanelProps) => {
  const { history } = props;
  const filteredSnippets = useSelector(selectFilteredSnippets);
  const listToPlayItemIds = useSelector(selectAllListToPlayItemIds);
  const checkboxHooks = useCheckbox();
  const { checked, clearChecked } = checkboxHooks;
  const { handlePlayListToPlay } = usePlayListToPlay(history, checked);
  const { handleShuffleListToPlay } = useShuffleListToPlay(checked);
  const { handleDeleteListToPlayItems } = useDeleteListToPlayItems(
    checked,
    clearChecked
  );
  const { handleClearListToPlay } = useClearListToPlay();

  // allow filtered snippets to be shown on list item
  // for details please refer to
  // LgPanelVirtualList/ LgPanelVirtualListItem
  const listToPlayItemData = createItemData({
    ...checkboxHooks,
    items: listToPlayItemIds,
    filteredSnippets,
  });

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
        <ClearNowPlayingBtn handleClearNowPlaying={handleClearListToPlay} />
      </div>

      <Divider />
      <LgPanelVirtualList itemData={listToPlayItemData}>
        {LgPanelVirtualListToPlayItem}
      </LgPanelVirtualList>
    </div>
  );
};

export default withRouter(LgNowPlayingPanel);
