import React, { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch } from "@material-ui/core";

import { togglePlayingVideoAction } from "../../../store/ytplaylist/action";

const AddVideoToPlayingSwitch = (props) => {
  const {
    itemId,

    // redux
    playingVideos,
    togglePlayingVideoAction,
  } = props;

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
      checked={playingVideos.includes(itemId)}
      onChange={handleToggleSwitch(itemId)}
      color="secondary"
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
