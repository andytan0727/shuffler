import React from "react";
import { InputTabs } from "../../components/Tabs";
import ToggleDarkModeSwitch from "../../components/Switches/ToggleDarkModeSwitch";

import styles from "./styles.module.scss";

const PlaylistInputPage = () => {
  return (
    <div className={styles.playlistInPgDiv}>
      <InputTabs />
      <ToggleDarkModeSwitch />
    </div>
  );
};

export default PlaylistInputPage;
