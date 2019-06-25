import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch } from "@material-ui/core";

import { togglePlayingVideo } from "../../../store/ytplaylist/action";

const AddVideoToPlayingSwitch = (props) => {
  const {
    itemId,

    // redux
    playingVideos,
    togglePlayingVideo,
  } = props;

  const handleToggleSwitch = (id) => () => {
    togglePlayingVideo(id);
  };

  useEffect(() => {
    if (playingVideos.includes(itemId)) handleToggleSwitch(itemId);
  }, []);

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
  togglePlayingVideo: PropTypes.func.isRequired,
};

const mapStatesToProps = ({ ytplaylist: { playingVideos } }) => ({
  playingVideos,
});

export default connect(
  mapStatesToProps,
  {
    togglePlayingVideo,
  }
)(AddVideoToPlayingSwitch);
