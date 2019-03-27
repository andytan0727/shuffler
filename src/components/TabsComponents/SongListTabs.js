import React, { useState } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

// import styles from "./styles.module.scss";

const muiStyles = theme => ({
  tab: {
    marginTop: -10,
    width: 500,
    background: theme.palette.background.paper
  }
});

const TabContainer = ({ children, dir }) => (
  <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
    {children}
  </Typography>
);

const SongListTabs = props => {
  const { classes, theme, FirstTabComponent, SecondTabComponent } = props;
  const [value, setValue] = useState(0);

  const handleChange = (event, value) => {
    setValue(value);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

  return (
    <div className={classes.tab}>
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

export default withStyles(muiStyles, { withTheme: true })(SongListTabs);
