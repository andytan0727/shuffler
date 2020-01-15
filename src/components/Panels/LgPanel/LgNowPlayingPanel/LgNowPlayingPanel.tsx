import { FilterAndCtrlBar } from "components/Bars";
import { ClearNowPlayingBtn } from "components/Buttons";
import { LgPanelVirtualList } from "components/Lists/LgPanelVirtualList";
import { LgPanelVirtualListToPlayItem } from "components/Lists/LgPanelVirtualList/LgPanelVirtualListItem";
import React from "react";
import { useSelector } from "react-redux";
import { selectAllListToPlayItemIds } from "store/ytplaylist/listToPlaySelectors";
import { useShowFilteredItems } from "utils/hooks/filteredHooks";
import {
  useClearListToPlay,
  useDeleteListToPlayItems,
  usePlayListToPlay,
  useShuffleListToPlay,
} from "utils/hooks/listToPlayHooks";

import { Divider, Typography } from "@material-ui/core";

import styles from "./styles.module.scss";

const LgNowPlayingPanel: React.FC = () => {
  const listToPlayItemIds = useSelector(selectAllListToPlayItemIds);
  const { checked, clearChecked, filteredItems } = useShowFilteredItems(
    listToPlayItemIds
  );
  const { handlePlayListToPlay } = usePlayListToPlay(checked);
  const { handleShuffleListToPlay } = useShuffleListToPlay(checked);
  const { handleDeleteListToPlayItems } = useDeleteListToPlayItems(
    checked,
    clearChecked
  );
  const { handleClearListToPlay } = useClearListToPlay();

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
      <LgPanelVirtualList itemData={filteredItems}>
        {LgPanelVirtualListToPlayItem}
      </LgPanelVirtualList>
    </div>
  );
};

export default LgNowPlayingPanel;
