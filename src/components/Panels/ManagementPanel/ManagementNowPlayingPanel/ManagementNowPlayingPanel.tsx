import React from "react";
import Typography from "@material-ui/core/Typography";

import styles from "./styles.module.scss";

const ManagementNowPlayingPanel = () => {
  return (
    <div className={styles.managementNowPlayingPanelDiv}>
      <Typography variant="h4">Now Playing</Typography>
      <div className={styles.underConstruction}>
        <Typography variant="h2">Under Construction</Typography>
      </div>
    </div>
  );
};

export default ManagementNowPlayingPanel;
