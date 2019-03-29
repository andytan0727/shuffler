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
import DeleteIcon from "@material-ui/icons/Delete";

import { clearListToPlay } from "../../store/ytplaylist/action";

import styles from "./styles.module.scss";

const muiStyles = theme => ({
  tab: {
    marginTop: -10,
    width: 500,
    height: "70vh",
    overflowY: "auto",
    background: theme.palette.background.paper
  },
  fab: {
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
    clearListToPlay
  } = props;
  const [value, setValue] = useState(1);

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen
  };

  const handleChange = (event, value) => {
    setValue(value);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

  const handleClearListToPlay = () => {
    if (window.confirm("Are you sure you want to clear playing list?")) {
      clearListToPlay();
    }
  };

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
      <Zoom
        in={value === 1}
        timeout={transitionDuration}
        style={{
          transitionDelay: `${value === 1 ? transitionDuration.exit : 0}ms`
        }}
        unmountOnExit
      >
        <Fab
          color="secondary"
          className={classes.fab}
          onClick={handleClearListToPlay}
        >
          <DeleteIcon />
        </Fab>
      </Zoom>
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
  ])
};

export default withStyles(muiStyles, { withTheme: true })(
  connect(
    null,
    {
      clearListToPlay
    }
  )(SongListTabs)
);
