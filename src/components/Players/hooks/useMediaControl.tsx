import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import YouTube from "react-youtube";
import { setCurSongIdx, toggleRepeat } from "store/ytplayer/action";
import { selectCurSongIdx } from "store/ytplayer/selector";
import { shuffleListToPlayAction } from "store/ytplaylist/listToPlayActions";
import { selectListToPlayResultSnippets } from "store/ytplaylist/listToPlaySelectors";
import { notify } from "utils/helper/notifyHelper";

export const useMediaControl = (ytPlayerRef: React.Ref<YouTube>) => {
  const curSongIdx = useSelector(selectCurSongIdx);
  const dispatch = useDispatch();

  const listToPlaySnippets = useSelector(selectListToPlayResultSnippets);

  const handlePrevious = useCallback(() => {
    if (curSongIdx > 0) {
      dispatch(setCurSongIdx(curSongIdx - 1));
      return;
    }
    notify("warning", "💢 This is the first video in your playlist!");
  }, [curSongIdx, dispatch]);

  const handlePlay = useCallback(() => {
    if (ytPlayerRef) {
      (ytPlayerRef as any).current.internalPlayer.playVideo();
    }
  }, [ytPlayerRef]);

  const handlePause = useCallback(() => {
    if (ytPlayerRef) {
      (ytPlayerRef as any).current.internalPlayer.pauseVideo();
    }
  }, [ytPlayerRef]);

  const handleNext = useCallback(() => {
    if (curSongIdx === listToPlaySnippets.length - 1) {
      notify("info", "🚀 You have reached last video in your playlist");
      return;
    }

    dispatch(setCurSongIdx(curSongIdx + 1));
  }, [curSongIdx, dispatch, listToPlaySnippets.length]);

  const handleShuffleListToPlay = useCallback(() => {
    dispatch(shuffleListToPlayAction());
    dispatch(setCurSongIdx(0));
  }, [dispatch]);

  const handleToggleRepeat = useCallback(() => {
    dispatch(toggleRepeat());
  }, [dispatch]);

  return {
    handlePrevious,
    handlePlay,
    handlePause,
    handleNext,
    handleShuffleListToPlay,
    handleToggleRepeat,
  };
};
