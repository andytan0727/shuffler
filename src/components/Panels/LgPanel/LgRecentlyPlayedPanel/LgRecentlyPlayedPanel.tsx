import React from "react";

import Typography from "@material-ui/core/Typography";

import styles from "./styles.module.scss";

const LgRecentlyPlayedPanel = () => {
  return (
    <div className={styles.lgRecentlyPlayedPanelDiv}>
      <Typography variant="h4">Recently Played</Typography>
      <div className={styles.underConstruction}>
        <Typography variant="h2">Under Construction</Typography>
      </div>
    </div>
  );
};

export default LgRecentlyPlayedPanel;
