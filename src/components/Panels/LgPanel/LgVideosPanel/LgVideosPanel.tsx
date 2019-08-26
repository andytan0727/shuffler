import { useCheckbox } from "components/Checkbox/hooks";
import { makeLgPanelSearchInput } from "components/Inputs";
import {
  createItemData,
  LgPanelVirtualList,
  PlaylistVideoListItemSecondaryAction,
  withListItemSecondaryAction,
} from "components/Lists/LgPanelVirtualList";
import React from "react";
import { useSelector } from "react-redux";
import { selectAllVideoItemIds } from "store/ytplaylist/videoSelectors";

import { Divider, Typography } from "@material-ui/core";

import styles from "./styles.module.scss";

const SearchVideoInput = makeLgPanelSearchInput("videos");

const LgPanelVirtualListVideoItem = withListItemSecondaryAction(
  PlaylistVideoListItemSecondaryAction
);

const LgVideosPanel = () => {
  const videoItemIds = useSelector(selectAllVideoItemIds);
  const checkboxHooks = useCheckbox();
  const videoItemData = createItemData({
    ...checkboxHooks,
    items: videoItemIds,
  });

  return (
    <div className={styles.lgVideosPanelDiv}>
      <Typography className={styles.header} variant="h4">
        My Video
      </Typography>
      <div className={styles.header}>
        <SearchVideoInput />
      </div>

      <Divider className={styles.header} />
      <LgPanelVirtualList itemData={videoItemData}>
        {LgPanelVirtualListVideoItem}
      </LgPanelVirtualList>
    </div>
  );
};

export default LgVideosPanel;
