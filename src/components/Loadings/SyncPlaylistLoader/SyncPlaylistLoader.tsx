import React from "react";
import { useSelector } from "react-redux";
import { selectPreferDarkTheme } from "store/userPreferences/selector";

import {
  CircularProgress,
  makeStyles,
  Snackbar,
  SnackbarContent,
  Theme,
} from "@material-ui/core";

interface StylesProps {
  preferDarkTheme: boolean;
}

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
  snackbarContent: (props) => ({
    backgroundColor: props.preferDarkTheme
      ? theme.palette.background.black
      : theme.palette.background.paper,
    color: theme.palette.text.primary,
    fontSize: "1.1rem",
  }),
  spinnerDiv: {
    width: "100%",
    display: "flex",
    alignItems: "center",

    "& span": {
      marginLeft: "1rem",
    },
  },
}));

interface SyncPlaylistLoaderProps {
  open: boolean;
}

const SyncPlaylistLoader: React.FunctionComponent<SyncPlaylistLoaderProps> = (
  props: SyncPlaylistLoaderProps
) => {
  const { open } = props;
  const preferDarkTheme = useSelector(selectPreferDarkTheme);
  const classes = useStyles({
    preferDarkTheme,
  });

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={open}
      data-testid="sync-playlist-loader"
    >
      <SnackbarContent
        className={classes.snackbarContent}
        message={
          <div className={classes.spinnerDiv}>
            <CircularProgress color="secondary" />
            <span>Syncing</span>
          </div>
        }
      />
    </Snackbar>
  );
};

export default SyncPlaylistLoader;
