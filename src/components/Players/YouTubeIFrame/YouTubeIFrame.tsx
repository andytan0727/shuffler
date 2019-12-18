import React, { forwardRef } from "react";
import { useSelector } from "react-redux";
import YouTube from "react-youtube";
import { selectCurSongIdx, selectPlayerVars } from "store/ytplayer/selector";
import { selectListToPlayResultSnippets } from "store/ytplaylist/listToPlaySelectors";
import { PlaylistItemSnippet, VideoItemSnippet } from "store/ytplaylist/types";
import { isPlaylistItemSnippet } from "store/ytplaylist/utils";

import { makeStyles } from "@material-ui/core";

import useYTIFrameEventListener from "../hooks/useYTIFrameEventListener";

interface YouTubeIFrameProps {
  forwardRef: React.Ref<YouTube>;
}

const useStyles = makeStyles({
  iframeContainer: {
    position: "relative",
    overflow: "hidden",
  },
  iframe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: 0,
  },
});

const YouTubeIFrame = (props: YouTubeIFrameProps) => {
  const { forwardRef } = props;
  const classes = useStyles();
  const curSongIdx = useSelector(selectCurSongIdx);
  const playerVars = useSelector(selectPlayerVars);
  const listToPLaySnippets = useSelector(selectListToPlayResultSnippets);
  const currentSnippet = listToPLaySnippets[curSongIdx];
  const {
    handleOnPlay,
    handleOnPause,
    handleOnEndSetNext,
    handleOnStateChange,
    handleOnError,
  } = useYTIFrameEventListener();

  return (
    <YouTube
      ref={forwardRef}
      containerClassName={classes.iframeContainer}
      className={classes.iframe}
      videoId={
        // playlist: if resourceId present
        // video: else
        isPlaylistItemSnippet(
          currentSnippet as PlaylistItemSnippet | VideoItemSnippet
        )
          ? (currentSnippet as PlaylistItemSnippet).resourceId.videoId
          : currentSnippet.id
      }
      opts={{
        width: "100%",
        height: "100%",
        playerVars: {
          ...playerVars,
        },
      }}
      onPlay={handleOnPlay}
      onPause={handleOnPause}
      onStateChange={handleOnStateChange}
      onEnd={handleOnEndSetNext}
      onError={handleOnError}
    />
  );
};

const YouTubeIFrameWithRef = forwardRef((props, ref: React.Ref<YouTube>) => {
  return <YouTubeIFrame forwardRef={ref} {...props} />;
});

YouTubeIFrameWithRef.displayName = "ConnectedYouTubeIFrame";

export default YouTubeIFrameWithRef;
