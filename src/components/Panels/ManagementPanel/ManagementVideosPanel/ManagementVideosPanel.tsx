import React from "react";
import { useSelector } from "react-redux";
import { Typography, Divider } from "@material-ui/core";
import { selectAllNormVideoItemIds } from "store/ytplaylist/normSelector";
import { makeManagementPanelSearchInput } from "components/Inputs";
import {
  ManagementPanelVirtualList,
  makeManagementPanelVirtualListItem,
} from "components/Lists/ManagementPanelVirtualList";

import styles from "./styles.module.scss";
import { useCheckbox } from "components/Checkbox/hooks";
import { createItemData } from "components/Lists/ManagementPanelVirtualList";

const SearchVideoInput = makeManagementPanelSearchInput("videos");

const ManagementPanelVirtualListVideoItem = makeManagementPanelVirtualListItem(
  "videos"
);

const ManagementVideosPanel = () => {
  const videoItemIds = useSelector(selectAllNormVideoItemIds);
  const { checked, handleSetChecked } = useCheckbox();
  const videoItemData = createItemData(checked, handleSetChecked, videoItemIds);

  return (
    <div className={styles.managementVideosPanelDiv}>
      <Typography className={styles.header} variant="h4">
        My Video
      </Typography>
      <div className={styles.header}>
        <SearchVideoInput />
      </div>

      <Divider className={styles.header} />
      <ManagementPanelVirtualList itemData={videoItemData}>
        {ManagementPanelVirtualListVideoItem}
      </ManagementPanelVirtualList>
    </div>
  );
};

export default ManagementVideosPanel;
