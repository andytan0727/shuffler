import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import YouTube from "react-youtube";
import { setCurSongIdx, setVideoPlaying } from "../../../store/ytplayer/action";
import { notify } from "../../../utils/helper/notifyHelper";

const YouTubeIFrame = (props) => {
  const {
    // ref from caller
    forwardRef,

    // redux
    listToPlay,
    curSongIdx,
    playerVars,

    // actions
    setCurSongIdx,
    setVideoPlaying,

    // own props
    playerWidth,
    playerHeight,
  } = props;

  const setPlaying = () => setVideoPlaying(true);

  const setPause = () => setVideoPlaying(false);

  // focus window to listen for keyboard shortcuts
  // fix the problem of unable to trigger keydown event
  // when YT IFrame is focused
  const setFocusWindow = () => window.focus();

  const setNext = () => {
    if (curSongIdx === listToPlay.length - 1) {
      notify("info", "🚀 You have reached last video in your playlist");
      return;
    }

    setCurSongIdx(curSongIdx + 1);
  };

  const handleVideoError = (e) => {
    switch (e.data) {
      case 101:
      case 150:
        // skip to next song when video playback in iframe is prohibited
        setNext();
        break;
      default:
        console.log("error code: " + e.data);
    }
  };

  return (
    <div id="player">
      <YouTube
        ref={forwardRef}
        videoId={listToPlay[curSongIdx].snippet.resourceId.videoId}
        opts={{
          width: playerWidth ? playerWidth : 640,
          height: playerHeight ? playerHeight : 390,
          playerVars: {
            ...playerVars,
          },
        }}
        onPlay={setPlaying}
        onPause={setPause}
        onStateChange={setFocusWindow}
        onEnd={setNext}
        onError={handleVideoError}
      />
    </div>
  );
};

YouTubeIFrame.propTypes = {
  playing: PropTypes.bool.isRequired,
  curSongIdx: PropTypes.number.isRequired,
  playerVars: PropTypes.object.isRequired,
  listToPlay: PropTypes.array,
  setCurSongIdx: PropTypes.func.isRequired,
  setVideoPlaying: PropTypes.func.isRequired,
  playerWidth: PropTypes.number.isRequired,
  playerHeight: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => {
  const {
    ytplayer: { playing, curSongIdx, playerVars },
    ytplaylist: { listToPlay },
  } = state;
  return {
    playing,
    curSongIdx,
    playerVars,
    listToPlay,
  };
};

const ConnectedYouTubeIFrame = connect(
  mapStateToProps,
  {
    setCurSongIdx,
    setVideoPlaying,
  }
)(YouTubeIFrame);

export default forwardRef(function youTubeIFrame(props, ref) {
  return <ConnectedYouTubeIFrame forwardRef={ref} {...props} />;
});
