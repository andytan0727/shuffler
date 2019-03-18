import React from "react";
import { Link } from "react-router-dom";
import TopBar from "../../TopBar";
import PlaylistInput from "../../PlaylistInput";

import Fab from "@material-ui/core/Fab";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles.module.scss";

const muiStyles = theme => ({
  fab: {
    borderRadius: 0
  }
});

const GetStartedLink = props => <Link to="/player" {...props} />;

const MainPage = props => {
  const { classes } = props;
  return (
    <div className={styles.mainPgDiv}>
      <header>
        <TopBar />
      </header>
      <div className={styles.mainPgContent1}>
        <p>Randomize your YouTube Playlist</p>
        {/* <Button variant="contained" color="primary">Get Started</Button> */}
        <Fab
          variant="extended"
          color="primary"
          aria-label="Get-Started"
          className={classes.fab}
          component={GetStartedLink}
          onClick={() => console.log('clicked')}
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
      <footer className={styles.footer}>
        <div>
          <section>
            <ul>
              <li>Home</li>
              <li>Player</li>
              <li>About</li>
            </ul>
          </section>
        </div>
        <div className={styles.copyright}>&copy; 2019 Andy Tan</div>
      </footer>
    </div>
  );
};

export default withStyles(muiStyles)(MainPage);
