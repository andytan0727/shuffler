import React from "react";
import { Divider, Typography } from "@material-ui/core";
import { withManagementPanelSearchInput } from "../../../Inputs/ManagementPanelSearchInput";

import ManagementPlaylistsPanelGrid from "./ManagementPlaylistsPanelGrid";

import styles from "./styles.module.scss";

const SearchPlaylistInput = withManagementPanelSearchInput("playlist");

const LargePlaylistsPanel = () => {
  return (
    <div className={styles.managementPlaylistsPanelDiv}>
      <Typography variant="h4">My Playlists</Typography>
      <SearchPlaylistInput />
      <Divider />
      <ManagementPlaylistsPanelGrid />
    </div>
  );
};

export default LargePlaylistsPanel;
