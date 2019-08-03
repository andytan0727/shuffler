import ManagementPlaylistsPanelGrid from "components/Grids/ManagementPlaylistsPanelGrid";
import { makeManagementPanelSearchInput } from "components/Inputs";
import React from "react";

import { Divider, Typography } from "@material-ui/core";

import styles from "./styles.module.scss";

const SearchPlaylistInput = makeManagementPanelSearchInput("playlists");

const ManagementPlaylistsPanelHome = () => {
  return (
    <div className={styles.managementPlaylistsPanelDiv}>
      <Typography variant="h4">My Playlists</Typography>
      <SearchPlaylistInput />
      <Divider />
      <ManagementPlaylistsPanelGrid />
    </div>
  );
};

export default ManagementPlaylistsPanelHome;
