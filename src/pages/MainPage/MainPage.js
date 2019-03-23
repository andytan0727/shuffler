import React from "react";
import { Link } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import TopBar from "../../components/BarComponents/TopBar";
import PlaylistInput from "../../components/InputComponents/PlaylistInput";

import { ReactComponent as ShufflerLogo } from "../../assets/shuffler-logo.svg";
import styles from "./styles.module.scss";

const muiStyles = theme => ({
  fab: {
    borderRadius: 0
  }
});

const theme = createMuiTheme({
  overrides: {
    MuiButton: {
      text: {
        background:
          "linear-gradient(90deg, rgba(94,35,216,1) 0%, rgba(112,42,255,1) 46%, rgba(224,42,255,1) 100%)",
        border: 0,
        color: "white",
        padding: "0 30px",
        boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)"
      }
    }
  },
  typography: { useNextVariants: true }
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
        <ShufflerLogo className={styles.logo} />
        <p>Randomize your YouTube Playlist</p>
        <MuiThemeProvider theme={theme}>
          <Button
            size="large"
            aria-label="Get-Started"
            className={classes.fab}
            component={GetStartedLink}
            onClick={() => console.log("clicked")}
          >
            Get Started
          </Button>
        </MuiThemeProvider>
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
