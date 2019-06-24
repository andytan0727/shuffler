import React, { forwardRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import YouTube from "react-youtube";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { setCurSongIdx, setVideoPlaying } from "../../../store/ytplayer/action";
import { shufflePlaylist } from "../../../store/ytplaylist/action";
import { notify } from "../../../utils/helper/notifyHelper";

const YouTubeIFrame = (props) => {
  const {
    // ref from caller
    forwardRef,

    // redux
    repeat,
    listToPlay,
    curSongIdx,
    playerVars,

    // actions
    setCurSongIdx,
    setVideoPlaying,
    shufflePlaylist,
  } = props;
  const matchesMobile = useMediaQuery("(max-width: 420px)");
  const [vidWidth, setVidWidth] = useState(0);

  const _setVidSize = () => {
    const vidWrapper = document.getElementById("player");
    setVidWidth(vidWrapper.width);
  };

  const setPlaying = () => {
    setVideoPlaying(true);
    document.title = listToPlay[curSongIdx].snippet.title;
  };

  const setPause = () => setVideoPlaying(false);

  // focus window to listen for keyboard shortcuts
  // fix the problem of unable to trigger keydown event
  // when YT IFrame is focused
  const setFocusWindow = () => window.focus();

  const setNext = (e) => {
    // special condition: loop one song
    // seek to 0 second using YouTube Iframe API
    if (listToPlay.length === 1 && repeat) {
      e.target.seekTo(0);
      return;
    }

    if (curSongIdx === listToPlay.length - 1) {
      if (!repeat) {
        notify("info", "🚀 You have reached last video in your playlist");
        setPause(); // set pause to prevent playing bug on last video
      } else {
        // if repeat is turned on
        // reindex to the first item in playing list
        // and shuffle it
        setCurSongIdx(0);
        shufflePlaylist();
      }
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
  repeat: PropTypes.bool.isRequired,
  curSongIdx: PropTypes.number.isRequired,
  playerVars: PropTypes.object.isRequired,
  listToPlay: PropTypes.array,
  setCurSongIdx: PropTypes.func.isRequired,
  setVideoPlaying: PropTypes.func.isRequired,
  shufflePlaylist: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const {
    ytplayer: { playing, repeat, curSongIdx, playerVars },
    ytplaylist: { listToPlay },
  } = state;
  return {
    playing,
    repeat,
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
    shufflePlaylist,
  }
)(YouTubeIFrame);

export default forwardRef(function youTubeIFrame(props, ref) {
  return <ConnectedYouTubeIFrame forwardRef={ref} {...props} />;
});
