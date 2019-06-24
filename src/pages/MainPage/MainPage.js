import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import { ReactComponent as ShufflerLogo } from "../../assets/shuffler-logo.svg";
import styles from "./styles.module.scss";

const useStyles = makeStyles({
  lightVariant: {
    background:
      "linear-gradient(90deg, rgba(94,35,216,1) 0%, rgba(112,42,255,1) 46%, rgba(224,42,255,1) 100%)",
    border: 0,
    color: "white",
    fontWeight: "bold",
    padding: "0 30px",
    fontSize: "18px",
    height: "3em",
  },
  darkVariant: {
    border: "3px solid white",
    fontWeight: "bold",
    color: "white",
    padding: "0 30px",
    fontSize: "18px",
    height: "3em",
  },
});

const GetStartedLink = forwardRef((props, ref) => (
  <Link to="/playlistInput" {...props} ref={ref} />
));

const MainPage = ({ preferDarkTheme }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={styles.mainPgDiv}>
        <ShufflerLogo className={styles.logo} />

        <p>
          Randomize your YouTube Playlist{" "}
          <span role="img" aria-label="main-page-music-emoji">
            🎶
          </span>
        </p>
        <Button
          aria-label="Get-Started"
          className={
            !preferDarkTheme ? classes.lightVariant : classes.darkVariant
          }
          component={GetStartedLink}
        >
          Get Started
        </Button>
      </div>
    </React.Fragment>
  );
};

MainPage.propTypes = {
  preferDarkTheme: PropTypes.bool.isRequired,
};

export default MainPage;
