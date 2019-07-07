import React, { forwardRef, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import YouTube from "react-youtube";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { setCurSongIdx, setVideoPlaying } from "../../../store/ytplayer/action";
import { shuffleListToPlayAction } from "../../../store/ytplaylist/action";
import { notify } from "../../../utils/helper/notifyHelper";

// focus window to listen for keyboard shortcuts
// fix the problem of unable to trigger keydown event
// when YT IFrame is focused
const _setFocusWindow = () => window.focus();

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
    shuffleListToPlayAction,
  } = props;
  const matchesMobile = useMediaQuery("(max-width: 420px)");
  const [vidWidth, setVidWidth] = useState(0);

  const setVidSize = useCallback(() => {
    const vidWrapper = document.getElementById("player");
    setVidWidth(vidWrapper.offsetWidth);
  }, []);

  const setPlaying = useCallback(() => {
    setVideoPlaying(true);
    document.title = listToPlay[curSongIdx].snippet.title;
  }, [curSongIdx, listToPlay, setVideoPlaying]);

  const setPause = useCallback(() => setVideoPlaying(false), [setVideoPlaying]);

  const setNext = useCallback(
    (e) => {
      const listLength = listToPlay.length;

      // special condition: loop one song
      // seek to 0 second using YouTube Iframe API
      if (listLength === 1 && repeat) {
        e.target.seekTo(0);
        return;
      }

      if (curSongIdx === listLength - 1) {
        if (!repeat) {
          notify("info", "🚀 You have reached last video in your playlist");
          setPause(); // set pause to prevent playing bug on last video
        } else {
          // if repeat is turned on
          // re-index to the first item in playing list
          // and shuffle it
          setCurSongIdx(0);
          shuffleListToPlayAction();
        }
        return;
      }

      setCurSongIdx(curSongIdx + 1);
    },
    [
      curSongIdx,
      listToPlay.length,
      repeat,
      setCurSongIdx,
      setPause,
      shuffleListToPlayAction,
    ]
  );

  const handleVideoError = useCallback(
    (e) => {
      switch (e.data) {
        case 101:
        case 150:
          // skip to next song when video playback in iframe is prohibited
          setNext();
          break;
        default:
          console.log("error code: " + e.data);
      }
    },
    [setNext]
  );

  useEffect(() => {
    window.addEventListener("resize", setVidSize);

    return () => {
      window.removeEventListener("resize", setVidSize);
    };
  }, [setVidSize]);

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
          width: matchesMobile ? vidWidth.toString() : "640",
          height: matchesMobile ? "200" : "390",
          playerVars: {
            ...playerVars,
          },
        }}
        onPlay={setPlaying}
        onPause={setPause}
        onStateChange={_setFocusWindow}
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
  shuffleListToPlayAction: PropTypes.func.isRequired,
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
    shuffleListToPlayAction,
  }
)(YouTubeIFrame);

export default forwardRef(function youTubeIFrame(props, ref) {
  return <ConnectedYouTubeIFrame forwardRef={ref} {...props} />;
});
