import React from "react";
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

const SongList = props => {
  const {
    ytplaylist: { listToPlay },
    classes
  } = props;

  return (
    <div className={styles.songListDiv}>
      {listToPlay.length !== 0 ? (
        <List className={classes.list}>
          {listToPlay.map(song => (
            <ListItem key={song.id}>
              <Checkbox checked={false} tabIndex={-1} disableRipple />
              <ListItemText primary={song.snippet.title} />
              <ListItemSecondaryAction>
                <IconButton aria-label="Delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <div>
          <h3>No Playlist</h3>
        </div>
      )}
    </div>
  );
};

SongList.propTypes = {
  listToPlay: PropTypes.array,
  classes: PropTypes.object.isRequired
};

const StyledSongList = withStyles(muiStyles)(SongList);

const mapStateToProps = ({ ytplaylist }) => ({
  ytplaylist
});

export default connect(
  mapStateToProps,
  {}
)(StyledSongList);
