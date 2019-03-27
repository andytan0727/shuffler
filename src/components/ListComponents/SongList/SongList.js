import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FixedSizeList } from "react-window";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import styles from "./styles.module.scss";

class FixedSizeListItem extends React.PureComponent {
  render() {
    const { index, style, data } = this.props;

    return (
      <div className={styles.listItem} style={style}>
        {data[index].snippet.title}
      </div>
    );
  }
}

const CollapseListItem = props => {
  const { playlist } = props;
  const [open, setOpen] = useState(false);

  const handleClick = (e, id) => {
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
            <FixedSizeList
              height={350}
              className={styles.songList}
              itemCount={playlist.items.length}
              itemSize={65}
              itemData={playlist.items}
              itemKey={(index, data) => data[index].id}
              width={400}
            >
              {FixedSizeListItem}
            </FixedSizeList>
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
        <List
          component="nav"

          // className={classes.root}
        >
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

SavedPlaylist.propTypes = {
  listToPlay: PropTypes.array
};

const mapStateToProps = ({ ytplaylist }) => ({
  ytplaylist
});

export default connect(
  mapStateToProps,
  {}
)(SavedPlaylist);
