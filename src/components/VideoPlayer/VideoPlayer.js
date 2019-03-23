import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import YouTube from "react-youtube";
import Button from "@material-ui/core/Button";

import { setCurSongIdx } from "../../store/ytplayer/action";

import styles from "./styles.module.scss";

const VideoPlayer = props => {
  const { curSongIdx, playerVars, listToPlay, setCurSongIdx } = props;
  const ytPlayer = useRef(null);

  const handlePause = e => {
    e.preventDefault();

    if (ytPlayer) {
      ytPlayer.current.internalPlayer.pauseVideo();
    }
  };

  const handlePlay = e => {
    e.preventDefault();

    if (ytPlayer) {
      ytPlayer.current.internalPlayer.playVideo();
    }
  };

  const handleNext = e => {
    e.preventDefault();

    if (ytPlayer) {
      console.log(ytPlayer.current.internalPlayer);
      setCurSongIdx(curSongIdx + 1);
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
          <div className={styles.ctrlBtnGroup}>
            <Button
              variant="outlined"
              color="primary"
              aria-label="play"
              onClick={handlePlay}
            >
              Play
            </Button>
            <Button
              variant="outlined"
              color="primary"
              aria-label="pause"
              onClick={handlePause}
            >
              Pause
            </Button>
            <Button
              variant="outlined"
              color="primary"
              aria-label="next"
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

VideoPlayer.propTypes = {
  playing: PropTypes.bool,
  curSongIdx: PropTypes.number,
  playerVars: PropTypes.object.isRequired,
  listToPlay: PropTypes.array,
  setCurSongIdx: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const {
    ytplayer: { playing, curSongIdx, playerVars },
    ytplaylist: { listToPlay }
  } = state;
  return {
    playing,
    curSongIdx,
    playerVars,
    listToPlay
  };
};

export default connect(
  mapStateToProps,
  {
    setCurSongIdx
  }
)(VideoPlayer);
