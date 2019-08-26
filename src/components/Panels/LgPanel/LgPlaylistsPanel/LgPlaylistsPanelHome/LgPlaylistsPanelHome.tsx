import LgPlaylistsPanelGrid from "components/Grids/LgPlaylistsPanelGrid";
import { makeLgPanelSearchInput } from "components/Inputs";
import React from "react";

import { Divider, Typography } from "@material-ui/core";

import styles from "./styles.module.scss";

const SearchPlaylistInput = makeLgPanelSearchInput("playlists");

const LgPlaylistsPanelHome = () => {
  return (
    <div className={styles.lgPlaylistsPanelDiv}>
      <Typography variant="h4">My Playlists</Typography>
      <SearchPlaylistInput />
      <Divider />
      <LgPlaylistsPanelGrid />
    </div>
  );
};

export default LgPlaylistsPanelHome;
