import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { ReactComponent as ShufflerLogo } from "assets/shuffler-logo.svg";
import styles from "./styles.module.scss";

interface MainPageConnectedState {
  preferDarkTheme: boolean;
}

type MainPageProps = MainPageConnectedState;

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

const GetStartedLink = forwardRef((props, ref: React.Ref<Link>) => (
  <Link to="/playlistInput" {...props} ref={ref} />
));

GetStartedLink.displayName = "GetStartedLink";

const MainPage = ({ preferDarkTheme }: MainPageProps) => {
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
          component={GetStartedLink as any}
        >
          Get Started
        </Button>
      </div>
    </React.Fragment>
  );
};

export default MainPage;
