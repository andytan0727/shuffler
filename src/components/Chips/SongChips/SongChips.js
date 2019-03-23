import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

import styles from "./styles.module.scss";

const muiStyles = theme => ({
  list: {
    width: "100%",
    maxWidth: "60vw",
    maxHeight: "65vh",
    backgroundColor: theme.palette.background.paper,
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    overflow: "auto"
  }
});

const SongChips = props => {
  const {
    ytplaylist: { playlists },
    classes
  } = props;

  return (
    <div className={styles.songChipsDiv}>
      {playlists.length !== 0 && (
        <List className={classes.list}>
          {playlists.map(playlist =>
            playlist.items.map(item => (
              <ListItem key={item.id}>
                <Checkbox checked={false} tabIndex={-1} disableRipple />
                <ListItemText primary={item.snippet.title} />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>
      )}
    </div>
  );
};

SongChips.propTypes = {
  playlists: PropTypes.array,
  classes: PropTypes.object.isRequired
};

const StyledSongChips = withStyles(muiStyles)(SongChips);

const mapStateToProps = ({ ytplaylist }) => ({
  ytplaylist
});

export default connect(
  mapStateToProps,
  {}
)(StyledSongChips);
