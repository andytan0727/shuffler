import React from "react";
import { Divider, Typography } from "@material-ui/core";
import { makeManagementPanelSearchInput } from "components/Inputs";

import ManagementPlaylistsPanelGrid from "./ManagementPlaylistsPanelGrid";

import styles from "./styles.module.scss";

const SearchPlaylistInput = makeManagementPanelSearchInput("playlists");

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
