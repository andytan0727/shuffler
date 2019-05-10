import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Collapse from "@material-ui/core/Collapse";
import Checkbox from "@material-ui/core/Checkbox";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import VideoList from "../VideoList";

import { setCheckedPlaylists } from "../../../store/ytplaylist/action";

// import styles from "./styles.module.scss";

const CollapseListItem = (props) => {
  const { playlist, checkedPlaylists, setCheckedPlaylists } = props;
  const [open, setOpen] = useState(false);
  const [listItemWidth, setListItemWidth] = useState(window.innerWidth * 0.75);
  const matchesMobile = useMediaQuery("(max-width: 420px)");

  const handleClick = (e) => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleToggle = (value) => () => {
    const currentIndex = checkedPlaylists.indexOf(value);
    const newChecked = [...checkedPlaylists];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedPlaylists(newChecked);
  };

  const setVideoItemSize = () => setListItemWidth(window.innerWidth * 0.75);

  useEffect(() => {
    window.addEventListener("resize", setVideoItemSize);
    return () => {
      // remove listener
      window.removeEventListener("resize", setVideoItemSize);
    };
  }, []);

  return (
    <React.Fragment>
      <ListItem button onClick={handleClick}>
        {open ? <ExpandLess /> : <ExpandMore />}
        <ListItemText>
          {playlist.name
            ? playlist.name
            : `${playlist.items[0].snippet.channelTitle}'s Playlist - ${
                playlist.id
              }`}
        </ListItemText>
        <ListItemSecondaryAction>
          <Checkbox
            onChange={handleToggle(playlist.id)}
            checked={checkedPlaylists.indexOf(playlist.id) !== -1}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem>
            {matchesMobile ? (
              <VideoList
                items={playlist.items}
                width={listItemWidth}
                height={200}
                isMobile
              />
            ) : (
              <VideoList
                items={playlist.items}
                width={700}
                height={400}
              />
            )}
          </ListItem>
        </List>
      </Collapse>
    </React.Fragment>
  );
};

const SavedPlaylist = (props) => {
  const {
    ytplaylist: { playlists, checkedPlaylists },
    setCheckedPlaylists,
  } = props;

  return (
    <React.Fragment>
      {playlists.length !== 0 ? (
        <List component="nav">
          {playlists.map((playlist) => (
            <CollapseListItem
              key={playlist.id}
              playlist={playlist}
              checkedPlaylists={checkedPlaylists}
              setCheckedPlaylists={setCheckedPlaylists}
            />
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
  playlist: PropTypes.object.isRequired,
  checkedPlaylists: PropTypes.array.isRequired,
  setCheckedPlaylists: PropTypes.func.isRequired,
};

SavedPlaylist.propTypes = {
  ytplaylist: PropTypes.object.isRequired,
};

const mapStateToProps = ({ ytplaylist }) => ({
  ytplaylist,
});

export default connect(
  mapStateToProps,
  {
    setCheckedPlaylists,
  }
)(SavedPlaylist);
