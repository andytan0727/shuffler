import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import VideoList from "../VideoList";

// import styles from "./styles.module.scss";

const CollapseListItem = props => {
  const { playlist } = props;
  const [open, setOpen] = useState(false);

  const handleClick = e => {
    setOpen(prevOpen => !prevOpen);
  };

  return (
    <React.Fragment>
      <ListItem button onClick={handleClick}>
        <ListItemText>
          {playlist.name
            ? playlist.name
            : `${playlist.items[0].snippet.channelTitle}'s Playlist - ${
                playlist.id
              }`}
        </ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button>
            <VideoList items={playlist.items} />
          </ListItem>
        </List>
      </Collapse>
    </React.Fragment>
  );
};

const SavedPlaylist = props => {
  const {
    ytplaylist: { playlists }
  } = props;

  return (
    <React.Fragment>
      {playlists.length !== 0 ? (
        <List component="nav">
          {playlists.map(playlist => (
            <CollapseListItem key={playlist.id} playlist={playlist} />
          ))}
        </List>
      ) : (
        <div>
          <h3>No Playlist</h3>
        </div>
      )}
    </React.Fragment>
  );
};

CollapseListItem.propTypes = {
  playlist: PropTypes.object.isRequired
};

SavedPlaylist.propTypes = {
  ytplaylist: PropTypes.object.isRequired
};

const mapStateToProps = ({ ytplaylist }) => ({
  ytplaylist
});

export default connect(
  mapStateToProps,
  {}
)(SavedPlaylist);
