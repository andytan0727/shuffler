import React from "react";
import { Link } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import { withStyles } from "@material-ui/core/styles";
import TopBar from "../../BarComponents/TopBar";
import PlaylistInput from "../../InputComponents/PlaylistInput";

import styles from "./styles.module.scss";

const muiStyles = theme => ({
  fab: {
    borderRadius: 0
  }
});

const GetStartedLink = props => <Link to="/playlistInput" {...props} />;

const MainPage = props => {
  const { classes } = props;
  return (
    <div className={styles.mainPgDiv}>
      <header>
        <TopBar />
      </header>
      <div className={styles.mainPgContent1}>
        <p>Randomize your YouTube Playlist</p>
        <Fab
          variant="extended"
          color="primary"
          aria-label="Get-Started"
          className={classes.fab}
          component={GetStartedLink}
          onClick={() => console.log("clicked")}
        >
          Get Started
        </Fab>
      </div>
      <div className={styles.mainPgContent2}>
        <p>Try to "real" random</p>
        <PlaylistInput />
      </div>
      <div className={styles.mainPgContent3}>
        <p>Unleash your passion</p>
      </div>
    </div>
  );
};

export default withStyles(muiStyles)(MainPage);
