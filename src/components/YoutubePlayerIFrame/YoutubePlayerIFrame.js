import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import YouTube from "react-youtube";

const YoutubePlayerIFrame = props => {
  const { playerVars } = props;
  return (
    <div id={"player"}>
      <YouTube
        // videoId={"M7lc1UVf-VE"}
        opts={{
          playerVars: {
            ...playerVars,
            listType: "playlist",
            list: "PL6nn1koAbIR_g6wG0CV2p-LgaOw2Lp9ON"
          }
        }}
      />
    </div>
  );
};

YoutubePlayerIFrame.propTypes = {
  playing: PropTypes.bool,
  playerVars: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { ytplayer } = state;
  return {
    playing: ytplayer.playing,
    playerVars: ytplayer.playerVars
  };
};

export default connect(
  mapStateToProps,
  {}
)(YoutubePlayerIFrame);
