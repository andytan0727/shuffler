import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurSongIdx, setVideoPlaying } from "store/ytplayer/action";
import { selectCurSongIdx, selectRepeat } from "store/ytplayer/selector";
import { shuffleListToPlayAction } from "store/ytplaylist/listToPlayActions";
import {
  selectListToPlayResultSnippets,
  selectListToPlayTotalItems,
} from "store/ytplaylist/listToPlaySelectors";
import { notify } from "utils/helper/notifyHelper";

// focus window to listen for keyboard shortcuts
// fix the problem of unable to trigger keydown event
// when YT IFrame is focused
const _setFocusWindow = () => window.focus();

const useYTIFrameEventListener = () => {
  const curSongIdx = useSelector(selectCurSongIdx);
  const repeat = useSelector(selectRepeat);
  const listToPLaySnippets = useSelector(selectListToPlayResultSnippets);
  const listToPlaySnippetsCount = useSelector(selectListToPlayTotalItems);
  const dispatch = useDispatch();
  const currentSnippet = listToPLaySnippets[curSongIdx];

  const handleOnPlay = useCallback(() => {
    dispatch(setVideoPlaying(true));
    document.title = currentSnippet.title;
  }, [currentSnippet, dispatch]);

  const handleOnPause = useCallback(() => {
    dispatch(setVideoPlaying(false));
  }, [dispatch]);

  const handleOnEndSetNext = useCallback(
    (e) => {
      // special condition: loop one song
      // seek to 0 second using YouTube Iframe API
      if (listToPlaySnippetsCount === 1 && repeat) {
        e.target.seekTo(0);
        return;
      }

      if (curSongIdx === listToPlaySnippetsCount - 1) {
        if (!repeat) {
          notify("info", "🚀 You have reached last video in your playlist");
          handleOnPause(); // set pause to prevent playing bug on last video
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
    [curSongIdx, dispatch, handleOnPause, listToPlaySnippetsCount, repeat]
  );

  const handleOnStateChange = useCallback(() => {
    _setFocusWindow();
  }, []);

  const handleOnError = useCallback(
    (e) => {
      switch (e.data) {
        case 101:
        case 150:
          // skip to next song when video playback in iframe is prohibited
          handleOnEndSetNext(e);
          break;
        default:
          console.log("error code: " + e.data);
      }
    },
    [handleOnEndSetNext]
  );

  return {
    handleOnPlay,
    handleOnPause,
    handleOnEndSetNext,
    handleOnStateChange,
    handleOnError,
  };
};

export default useYTIFrameEventListener;
