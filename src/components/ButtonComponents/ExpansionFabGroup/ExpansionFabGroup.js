import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import Slide from "@material-ui/core/Slide";
import Tooltip from "@material-ui/core/Tooltip";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { customSwal } from "../../../utils/helper/notifyHelper";

import {
  removePlaylist,
  addListToPlay,
  clearListToPlay,
} from "../../../store/ytplaylist/action";

const muiStyles = (theme) => ({
  fabExpand: {
    position: "absolute",
    bottom: theme.spacing.unit,
    right: "12%",
  },
  fabCollapse: {
    position: "absolute",
    bottom: theme.spacing.unit,
    right: "12%",
  },

  // fabExpand children
  fabAdd: {
    position: "absolute",
    bottom: "18%",
    right: "12%",
  },
  fabRemovePlaylist: {
    position: "absolute",
    bottom: "33%",
    right: "12%",
  },

  fabClearPlaying: {
    position: "absolute",
    bottom: theme.spacing.unit,
    right: "12%",
  },
});

const ExpansionFabGroup = (props) => {
  const {
    classes,
    theme,
    tabValue,
    checkedPlaylists,
    removePlaylist,
    addListToPlay,
    clearListToPlay,
  } = props;
  const [expand, setExpand] = useState(false);

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const handleAddPlaylistToPlaying = async () => {
    if (!checkedPlaylists.length) {
      await customSwal.fire({
        title: "No playlist is selected!💢",
        text: "Please select at least one playlist!",
        type: "warning",
      });
      return;
    }

    addListToPlay({
      checked: true,
      persist: true,
    });
    await customSwal.fire(
      "Added.",
      "Selected playlist is added to playing list 😎",
      "success"
    );
  };

  const handleRemovePlaylist = async () => {
    if (!checkedPlaylists.length) {
      await customSwal.fire({
        title: "No playlist is selected!💢",
        text: "Please select at least one playlist!",
        type: "warning",
      });
      return;
    }

    const result = await customSwal.fire({
      title: "Remove playlist",
      text: "Are you sure?🤔",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it please!🔥",
      cancelButtonText: "No!!!😱",
    });

    if (result.value) {
      removePlaylist();
      await customSwal.fire(
        "Deleted!",
        "Playlist has been deleted 😎",
        "success"
      );
    }
  };

  const handleClearListToPlay = async () => {
    const result = await customSwal.fire({
      title: "Clear playing list",
      text: "Are you sure?🤔",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear it please!🔥",
      cancelButtonText: "No!!!😱",
    });

    if (result.value) {
      clearListToPlay();
      await customSwal.fire(
        "Cleared!",
        "Playing list has been cleared 😎",
        "success"
      );
    }
  };

  const fabs = [
    {
      color: "primary",
      tabIdx: 0,
      className: !expand ? classes.fabExpand : classes.fabCollapse,
      tooltip: !expand ? "expand" : "collapse",
      icon: !expand ? <ExpandLessIcon /> : <ExpandMoreIcon />,
      func: () => setExpand((prevExpand) => !prevExpand),
    },
    {
      color: "secondary",
      tabIdx: 1,
      className: classes.fabClearPlaying,
      tooltip: "clear playing",
      icon: <DeleteIcon />,
      func: handleClearListToPlay,
    },
  ];

  const fabExpandGroup = [
    {
      color: "secondary",
      tabIdx: 0,
      className: classes.fabAdd,
      tooltip: "add playlist to playing",
      icon: <AddIcon />,
      func: handleAddPlaylistToPlaying,
    },
    {
      color: "secondary",
      tabIdx: 0,
      className: classes.fabRemovePlaylist,
      tooltip: "remove playlist",
      icon: <DeleteIcon />,
      func: handleRemovePlaylist,
    },
  ];

  return (
    <React.Fragment>
      {fabs.map((fab, idx) => (
        <Zoom
          key={idx}
          in={fab.tabIdx === tabValue}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${
              fab.tabIdx === tabValue ? transitionDuration.exit : 0
            }ms`,
          }}
          unmountOnExit
        >
          <Tooltip title={fab.tooltip}>
            <Fab color={fab.color} className={fab.className} onClick={fab.func}>
              {fab.icon}
            </Fab>
          </Tooltip>
        </Zoom>
      ))}
      <Slide
        in={expand && tabValue === 0}
        direction="up"
        timeout={transitionDuration}
        mountOnEnter
        unmountOnExit
      >
        <React.Fragment>
          {fabExpandGroup.map((fab, idx) => (
            <Tooltip key={idx} title={fab.tooltip}>
              <Fab
                color={fab.color}
                className={fab.className}
                onClick={fab.func}
              >
                {fab.icon}
              </Fab>
            </Tooltip>
          ))}
        </React.Fragment>
      </Slide>
    </React.Fragment>
  );
};

ExpansionFabGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  tabValue: PropTypes.number.isRequired,
  checkedPlaylists: PropTypes.array.isRequired,
  removePlaylist: PropTypes.func.isRequired,
  addListToPlay: PropTypes.func.isRequired,
  clearListToPlay: PropTypes.func.isRequired,
};

const mapStateToProps = ({ ytplaylist: { checkedPlaylists } }) => ({
  checkedPlaylists,
});

export default withStyles(muiStyles, { withTheme: true })(
  connect(
    mapStateToProps,
    {
      removePlaylist,
      addListToPlay,
      clearListToPlay,
    }
  )(ExpansionFabGroup)
);
