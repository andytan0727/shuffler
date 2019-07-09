import React, { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, makeStyles } from "@material-ui/core";

import { togglePlayingVideoAction } from "../../../store/ytplaylist/action";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(16px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: theme.palette.secondary.main,
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#52d869",
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}));

const AddVideoToPlayingSwitch = (props) => {
  const {
    itemId,

    // redux
    playingVideos,
    togglePlayingVideoAction,
  } = props;
  const classes = useStyles({});

  const handleToggleSwitch = useCallback(
    (id) => () => {
      togglePlayingVideoAction(id);
    },
    [togglePlayingVideoAction]
  );

  useEffect(() => {
    if (playingVideos.includes(itemId)) handleToggleSwitch(itemId);
  }, [handleToggleSwitch, itemId, playingVideos]);

  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      checked={playingVideos.includes(itemId)}
      onChange={handleToggleSwitch(itemId)}
    ></Switch>
  );
};

AddVideoToPlayingSwitch.propTypes = {
  itemId: PropTypes.string.isRequired,
  playingVideos: PropTypes.arrayOf(PropTypes.string).isRequired,
  togglePlayingVideoAction: PropTypes.func.isRequired,
};

const mapStatesToProps = ({ ytplaylist: { playingVideos } }) => ({
  playingVideos,
});

export default connect(
  mapStatesToProps,
  {
    togglePlayingVideoAction,
  }
)(AddVideoToPlayingSwitch);
