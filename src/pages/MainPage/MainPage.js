import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

import { ReactComponent as ShufflerLogo } from "../../assets/shuffler-logo.svg";
import styles from "./styles.module.scss";

const muiStyles = () => ({
  fabLight: {
    background:
      "linear-gradient(90deg, rgba(94,35,216,1) 0%, rgba(112,42,255,1) 46%, rgba(224,42,255,1) 100%)",
    border: 0,
    color: "white",
    fontWeight: "bold",
    padding: "0 30px",
    fontSize: "18px",
    height: "3em",
  },
  fabDark: {
    border: "3px solid white",
    fontWeight: "bold",
    color: "white",
    padding: "0 30px",
    fontSize: "18px",
    height: "3em",
  },
});

const GetStartedLink = (props) => <Link to="/playlistInput" {...props} />;

const MainPage = (props) => {
  const { classes, preferDarkTheme } = props;
  return (
    <React.Fragment>
      <div className={styles.mainPgDiv}>
        <svg
          className={styles.pulse}
          viewBox="0 0 1300 1300"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle id="Oval1" cx="400" cy="400" r="400" />
          <circle id="Oval2" cx="600" cy="600" r="450" />
          <circle id="Oval3" cx="500" cy="450" r="500" />
          <circle id="Oval4" cx="700" cy="500" r="550" />
          <circle id="Oval5" cx="750" cy="550" r="580" />
        </svg>
        <ShufflerLogo className={styles.logo} />

        <p>
          Randomize your YouTube Playlist{" "}
          <span role="img" aria-label="main-page-music-emoji">
            🎶
          </span>
        </p>
        <Button
          aria-label="Get-Started"
          className={!preferDarkTheme ? classes.fabLight : classes.fabDark}
          component={GetStartedLink}
        >
          Get Started
        </Button>
      </div>
    </React.Fragment>
  );
};

MainPage.propTypes = {
  classes: PropTypes.object.isRequired,
  preferDarkTheme: PropTypes.bool.isRequired,
};

export default withStyles(muiStyles)(MainPage);
