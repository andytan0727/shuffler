import React, { forwardRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import YouTube from "react-youtube";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
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
  } = props;
  const matchesMobile = useMediaQuery("(max-width: 420px)");
  const [vidWidth, setVidWidth] = useState(0);

  const _setVidSize = () => {
    const vidWrapper = document.getElementById("player");
    setVidWidth(vidWrapper.width);
  };

  const setPlaying = () => setVideoPlaying(true);

  const setPause = () => setVideoPlaying(false);

  // focus window to listen for keyboard shortcuts
  // fix the problem of unable to trigger keydown event
  // when YT IFrame is focused
  const setFocusWindow = () => window.focus();

  const setNext = () => {
    if (curSongIdx === listToPlay.length - 1) {
      notify("info", "🚀 You have reached last video in your playlist");
      setPause(); // set pause to prevent playing bug on last video
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

  useEffect(() => {
    window.addEventListener("resize", _setVidSize);

    return () => {
      // remove listeners
      window.removeEventListener("resize", _setVidSize);
    };
  }, []);

  return (
    <div id="player">
      <YouTube
        ref={forwardRef}
        videoId={
          // playlist: if resourceId present
          // video: else
          listToPlay[curSongIdx].snippet.resourceId
            ? listToPlay[curSongIdx].snippet.resourceId.videoId
            : listToPlay[curSongIdx].id
        }
        opts={{
          width: matchesMobile ? vidWidth : 640,
          height: matchesMobile ? 200 : 390,
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
