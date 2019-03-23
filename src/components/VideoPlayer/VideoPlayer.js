import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import YouTube from "react-youtube";

const VideoPlayer = props => {
  const { playerVars, listToPlay } = props;
  const ytPlayer = useRef(null);
  const [curSongIdx, setCurSongIdx] = useState(0);

  const handlePause = () => {
    if (ytPlayer) {
      ytPlayer.current.internalPlayer.pauseVideo();
    }
  };

  const handlePlay = () => {
    if (ytPlayer) {
      ytPlayer.current.internalPlayer.playVideo();
    }
  };

  const handleNext = () => {
    if (ytPlayer) {
      console.log(ytPlayer.current.internalPlayer);
      setCurSongIdx(prevSongIdx => prevSongIdx + 1);
    }
  };

  useEffect(() => {
    // return () => {
    //   ytPlayer.current.internalPlayer.destroy();
    // };
  });

  return (
    <React.Fragment>
      {listToPlay.length && (
        <div id={"player"}>
          <YouTube
            ref={ytPlayer}
            videoId={listToPlay[curSongIdx].snippet.resourceId.videoId}
            opts={{
              playerVars: {
                ...playerVars
                // list: "PL6nn1koAbIR_g6wG0CV2p-LgaOw2Lp9ON"
              }
            }}
            onReady={() => alert("ready")}
          />
          <button onClick={handlePause}>Pause</button>
          <button onClick={handlePlay}>Play</button>
          <button onClick={handleNext}>Next</button>
        </div>
      )}
    </React.Fragment>
  );
};

VideoPlayer.propTypes = {
  playing: PropTypes.bool,
  playerVars: PropTypes.object.isRequired,
  listToPlay: PropTypes.array
};

const mapStateToProps = state => {
  const {
    ytplayer: { playing, playerVars },
    ytplaylist: { listToPlay }
  } = state;
  return {
    playing,
    playerVars,
    listToPlay
  };
};

export default connect(
  mapStateToProps,
  {}
)(VideoPlayer);
