import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SwipeableViews from "react-swipeable-views";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Swal from "sweetalert2";

import {
  removePlaylist,
  addListToPlay,
  clearListToPlay
} from "../../store/ytplaylist/action";

import styles from "./styles.module.scss";

const muiStyles = theme => ({
  tab: {
    marginTop: -10,
    width: 500,
    height: "70vh",
    overflowY: "auto",
    background: theme.palette.background.paper
  },
  fabAdd: {
    position: "absolute",
    bottom: theme.spacing.unit,
    right: "26%"
  },
  fabDelete: {
    position: "absolute",
    bottom: theme.spacing.unit,
    right: "15%"
  }
});

const TabContainer = ({ children, dir }) => (
  <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
    {children}
  </Typography>
);

const SongListTabs = props => {
  const {
    classes,
    theme,
    FirstTabComponent,
    SecondTabComponent,
    checkedPlaylists,
    removePlaylist,
    addListToPlay,
    clearListToPlay
  } = props;
  const [value, setValue] = useState(1);
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen
  };
  const customSwal = Swal.mixin({
    customClass: {
      confirmButton: styles.swalSuccessButton,
      cancelButton: styles.swalCancelButton
    },
    buttonsStyling: false
  });

  const handleChange = (event, value) => {
    setValue(value);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

  const handleAddPlaylistToPlaying = async () => {
    if (!checkedPlaylists.length) {
      await customSwal.fire({
        title: "No playlist has been selected!",
        text: "Please select atleast one playlist!",
        type: "warning"
      });
      return;
    }

    addListToPlay({
      checked: true,
      persist: true
    });
    await customSwal.fire(
      "Added.",
      "Playlist(s) that you selected has been added to playing list.",
      "success"
    );
  };

  const handleRemovePlaylist = async () => {
    if (!checkedPlaylists.length) {
      await customSwal.fire({
        title: "No playlist has been selected!",
        text: "Please select atleast one playlist!",
        type: "warning"
      });
      return;
    }

    const result = await customSwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it please!",
      cancelButtonText: "No!!!"
    });

    if (result.value) {
      removePlaylist();
      await customSwal.fire(
        "Deleted!",
        "Playlist has been deleted.",
        "success"
      );
    }
  };

  const handleClearListToPlay = async () => {
    const result = await customSwal.fire({
      title: "Clear playing?",
      text: "Are you sure?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear it please!",
      cancelButtonText: "No!!!"
    });

    if (result.value) {
      clearListToPlay();
      await customSwal.fire(
        "Cleared!",
        "Playing list has been cleared.",
        "success"
      );
    }
  };

  const fabs = [
    {
      color: "primary",
      tabIdx: 0,
      className: classes.fabAdd,
      tooltip: "add to playing",
      icon: <AddIcon />,
      func: handleAddPlaylistToPlaying
    },
    {
      color: "secondary",
      tabIdx: 0,
      className: classes.fabDelete,
      tooltip: "delete playlist(s)",
      icon: <DeleteIcon />,
      func: handleRemovePlaylist
    },
    {
      color: "secondary",
      tabIdx: 1,
      className: classes.fabDelete,
      tooltip: "clear playing",
      icon: <DeleteIcon />,
      func: handleClearListToPlay
    }
  ];

  return (
    <div className={`${classes.tab} ${styles.tab}`}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Saved" />
          <Tab label="Playing" />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabContainer dir={theme.direction}>
          <FirstTabComponent />
        </TabContainer>
        <TabContainer dir={theme.direction}>
          <SecondTabComponent />
        </TabContainer>
      </SwipeableViews>
      {fabs.map((fab, idx) => (
        <Zoom
          key={idx}
          in={fab.tabIdx === value}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${
              fab.tabIdx === value ? transitionDuration.exit : 0
            }ms`
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
    </div>
  );
};

SongListTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  FirstTabComponent: PropTypes.oneOfType([
    PropTypes.node.isRequired,
    PropTypes.func.isRequired
  ]),
  SecondTabComponent: PropTypes.oneOfType([
    PropTypes.node.isRequired,
    PropTypes.func.isRequired
  ]),
  removePlaylist: PropTypes.func.isRequired,
  addListToPlay: PropTypes.func.isRequired,
  clearListToPlay: PropTypes.func.isRequired
};

const mapStateToProps = ({ ytplaylist: { checkedPlaylists } }) => ({
  checkedPlaylists
});

export default withStyles(muiStyles, { withTheme: true })(
  connect(
    mapStateToProps,
    {
      removePlaylist,
      addListToPlay,
      clearListToPlay
    }
  )(SongListTabs)
);
