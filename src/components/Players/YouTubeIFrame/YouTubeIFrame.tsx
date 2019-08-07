import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import YouTube, { PlayerVars } from "react-youtube";
import { AppState } from "store";
import { setCurSongIdx, setVideoPlaying } from "store/ytplayer/action";
import { shuffleListToPlayAction } from "store/ytplaylist/sharedAction";
import { ListToPlayItems, PlaylistItem } from "store/ytplaylist/types";
import { notify } from "utils/helper/notifyHelper";

import { useMediaQuery } from "@material-ui/core";

interface YouTubeIFrameConnectedState {
  repeat: boolean;
  listToPlay: ListToPlayItems;
  curSongIdx: number;
  playerVars: PlayerVars;
}

interface YouTubeIFrameConnectedDispatch {
  setCurSongIdx: typeof setCurSongIdx;
  setVideoPlaying: typeof setVideoPlaying;
  shuffleListToPlayAction: typeof shuffleListToPlayAction;
}

interface YouTubeIFrameOwnProps {
  forwardRef: React.Ref<any>;
}

type YouTubeIFrameProps = YouTubeIFrameOwnProps &
  YouTubeIFrameConnectedState &
  YouTubeIFrameConnectedDispatch;

// focus window to listen for keyboard shortcuts
// fix the problem of unable to trigger keydown event
// when YT IFrame is focused
const _setFocusWindow = () => window.focus();

const YouTubeIFrame = (props: YouTubeIFrameProps) => {
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
    if (vidWrapper) setVidWidth(vidWrapper.offsetWidth);
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
          setNext(e);
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
          (listToPlay[curSongIdx] as PlaylistItem).snippet.resourceId
            ? (listToPlay[curSongIdx] as PlaylistItem).snippet.resourceId
                .videoId
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

const mapStateToProps = (state: AppState) => {
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

const ConnectedYouTubeIFrameWithRef = forwardRef((props, ref) => {
  return <ConnectedYouTubeIFrame forwardRef={ref} {...props} />;
});

ConnectedYouTubeIFrameWithRef.displayName = "ConnectedYouTubeIFrame";

export default ConnectedYouTubeIFrameWithRef;
