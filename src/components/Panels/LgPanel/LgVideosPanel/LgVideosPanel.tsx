import { useCheckbox } from "components/Checkbox/hooks";
import { makeLgPanelSearchInput } from "components/Inputs";
import {
  createItemData,
  LgPanelVirtualList,
} from "components/Lists/LgPanelVirtualList";
import React from "react";
import { useSelector } from "react-redux";
import { selectAllVideoItemIds } from "store/ytplaylist/videoSelectors";
import { useDragVideoItem } from "utils/hooks/videosHooks/useDragVideoItem";

import { Divider, Typography } from "@material-ui/core";

import styles from "./styles.module.scss";

const SearchVideoInput = makeLgPanelSearchInput("videos");

const LgVideosPanel = () => {
  const videoItemIds = useSelector(selectAllVideoItemIds) as string[];
  const checkboxHooks = useCheckbox();
  const videoItemData = createItemData({
    ...checkboxHooks,
    itemIds: videoItemIds,
  });
  const { handleOnDragEnd } = useDragVideoItem();

  return (
    <div className={styles.lgVideosPanelDiv}>
      <Typography className={styles.header} variant="h4">
        My Video
      </Typography>
      <div className={styles.header}>
        <SearchVideoInput />
      </div>

      <Divider className={styles.header} />
      <LgPanelVirtualList
        itemData={videoItemData}
        snippetType="pv"
        onDragEnd={handleOnDragEnd}
      />
    </div>
  );
};

export default LgVideosPanel;
