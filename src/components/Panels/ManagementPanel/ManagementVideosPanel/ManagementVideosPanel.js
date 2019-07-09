import React from "react";
import { useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { withManagementPanelSearchInput } from "../../../Inputs/ManagementPanelSearchInput";
import ManagementPanelVirtualList, {
  withManagementPanelVirtualListItem,
} from "../../../Lists/ManagementPanelVirtualList";

import { videoItemsSelector } from "../../../../store/ytplaylist/selector";

import styles from "./styles.module.scss";

const SearchVideoInput = withManagementPanelSearchInput("video");

const ManagementPanelVirtualListVideoItem = withManagementPanelVirtualListItem(
  "video"
);

const ManagementVideosPanel = () => {
  const videoItems = useSelector(videoItemsSelector);

  return (
    <div className={styles.managementVideosPanelDiv}>
      <Typography className={styles.header} variant="h4">
        My Video
      </Typography>
      <div className={styles.header}>
        <SearchVideoInput />
      </div>

      <Divider className={styles.header} />
      {/* 
       // @ts-ignore */}
      <ManagementPanelVirtualList items={videoItems}>
        {/*
         // @ts-ignore */}
        {ManagementPanelVirtualListVideoItem}
      </ManagementPanelVirtualList>
    </div>
  );
};

export default ManagementVideosPanel;
