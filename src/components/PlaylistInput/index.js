import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
// import List from "@material-ui/core/List";
// import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";

import styles from "./styles.module.scss";

const muiStyles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

const PlaylistInput = props => {
  const { classes } = props;

  return (
    <div className={styles.playlistDiv}>
      <ul className={styles.list}>
        <li>
          <TextField
            id="outlined-playlist"
            label="Playlist"
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />
        </li>
        <li>
          <Typography variant="h5" align="center">
            -- or --
          </Typography>
        </li>
        <li>
          <TextField
            id="outlined-song"
            label="Song"
            // className={classes.textField}
            margin="normal"
            variant="outlined"
          />
        </li>
      </ul>
    </div>
  );
};

export default withStyles(muiStyles)(PlaylistInput);
