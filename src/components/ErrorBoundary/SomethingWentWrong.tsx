import React from "react";

import { Fab, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { Refresh as RefreshIcon } from "@material-ui/icons";

const useStyles = makeStyles({
  someThingWentWrongDiv: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  refreshBtn: {
    marginTop: "3rem",
  },
});

const SomethingWentWrong = () => {
  const classes = useStyles();

  const handleRefreshPage = () => {
    window.location.reload();
  };

  return (
    <div className={classes.someThingWentWrongDiv}>
      <Typography variant="h2" component="h1">
        Oops, Something Went Wrong!
      </Typography>
      <Tooltip className={classes.refreshBtn} title="Try Refresh">
        <Fab
          variant="round"
          size="large"
          onClick={handleRefreshPage}
          aria-label="refresh"
        >
          <RefreshIcon fontSize="large" />
        </Fab>
      </Tooltip>
    </div>
  );
};

export default SomethingWentWrong;
