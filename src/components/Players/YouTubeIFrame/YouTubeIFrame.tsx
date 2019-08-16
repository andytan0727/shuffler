import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import YouTube from "react-youtube";
import { setCurSongIdx, setVideoPlaying } from "store/ytplayer/action";
import {
  selectCurSongIdx,
  selectPlayerVars,
  selectRepeat,
} from "store/ytplayer/selector";
import { shuffleListToPlayAction } from "store/ytplaylist/listToPlayActions";
import { selectNormListToPlayResultSnippets } from "store/ytplaylist/listToPlaySelectors";
import { PlaylistItemSnippet, VideoItemSnippet } from "store/ytplaylist/types";
import { isPlaylistItemSnippet } from "store/ytplaylist/utils";
import { notify } from "utils/helper/notifyHelper";

import { useMediaQuery } from "@material-ui/core";

interface YouTubeIFrameProps {
  forwardRef: React.Ref<any>;
}

// focus window to listen for keyboard shortcuts
// fix the problem of unable to trigger keydown event
// when YT IFrame is focused
const _setFocusWindow = () => window.focus();

const YouTubeIFrame = (props: YouTubeIFrameProps) => {
  const { forwardRef } = props;
  const curSongIdx = useSelector(selectCurSongIdx);
  const playerVars = useSelector(selectPlayerVars);
  const repeat = useSelector(selectRepeat);
  const listToPLaySnippets = useSelector(selectNormListToPlayResultSnippets);
  const dispatch = useDispatch();
  const currentSnippet = listToPLaySnippets[curSongIdx];

  const matchesMobile = useMediaQuery("(max-width: 420px)");
  const [vidWidth, setVidWidth] = useState(0);

  const setVidSize = useCallback(() => {
    const vidWrapper = document.getElementById("player");
    if (vidWrapper) setVidWidth(vidWrapper.offsetWidth);
  }, []);

  const setPlaying = useCallback(() => {
    dispatch(setVideoPlaying(true));
    document.title = currentSnippet.title;
  }, [currentSnippet, dispatch]);

  const setPause = useCallback(() => {
    dispatch(setVideoPlaying(false));
  }, [dispatch]);

  const setNext = useCallback(
    (e) => {
      const listLength = listToPLaySnippets.length;

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
          dispatch(setCurSongIdx(0));
          dispatch(shuffleListToPlayAction());
        }
        return;
      }

      dispatch(setCurSongIdx(curSongIdx + 1));
    },
    [curSongIdx, dispatch, listToPLaySnippets.length, repeat, setPause]
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
          isPlaylistItemSnippet(currentSnippet as (
            | PlaylistItemSnippet
            | VideoItemSnippet))
            ? (currentSnippet as PlaylistItemSnippet).resourceId.videoId
            : currentSnippet.id
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

const YouTubeIFrameWithRef = forwardRef((props, ref) => {
  return <YouTubeIFrame forwardRef={ref} {...props} />;
});

YouTubeIFrameWithRef.displayName = "ConnectedYouTubeIFrame";

export default YouTubeIFrameWithRef;
