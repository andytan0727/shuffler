import React from "react";

import Typography from "@material-ui/core/Typography";

import styles from "./styles.module.scss";

const ManagementRecentlyPlayedPanel = () => {
  return (
    <div className={styles.managementRecentlyPlayedPanelDiv}>
      <Typography variant="h4">Recently Played</Typography>
      <div className={styles.underConstruction}>
        <Typography variant="h2">Under Construction</Typography>
      </div>
    </div>
  );
};

export default ManagementRecentlyPlayedPanel;
