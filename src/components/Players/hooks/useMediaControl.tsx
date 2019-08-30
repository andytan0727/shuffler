import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import YouTube from "react-youtube";
import { setCurSongIdx, toggleRepeat } from "store/ytplayer/action";
import { selectCurSongIdx, selectPlaying } from "store/ytplayer/selector";
import { shuffleListToPlayAction } from "store/ytplaylist/listToPlayActions";
import { selectListToPlayResultSnippets } from "store/ytplaylist/listToPlaySelectors";
import { useKeyDown } from "utils/helper/keyboardShortcutHelper";
import { notify } from "utils/helper/notifyHelper";

export const useMediaControl = (ytPlayerRef: React.Ref<YouTube>) => {
  const curSongIdx = useSelector(selectCurSongIdx);
  const playing = useSelector(selectPlaying);
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

  // fix play/pause problem when Spacebar is pressed after clicking buttons
  const handleBlur = useCallback((e) => {
    e.target.blur();
  }, []);

  const playerKeyboardShortcuts = useCallback(
    async (e) => {
      const keyCode = e.keyCode;
      const arrowCode = { left: 37, up: 38, right: 39, down: 40 };

      // SpaceKey (play/pause)
      if (keyCode === 32 || e.keyC === " " || e.key === "Spacebar") {
        // blur anything else to prevent Spacebar bugs
        handleBlur(e);

        if (playing) {
          handlePause();
          return;
        }

        if (!playing) {
          handlePlay();
          return;
        }
      }

      if (e.ctrlKey) {
        // ctrl+alt+s (shuffle playing list)
        if (e.ctrlKey && e.altKey && e.key === "s") {
          handleShuffleListToPlay();
          return;
        }

        // ctrl+arrow (fast forward/backward)
        switch (keyCode) {
          case arrowCode.left: {
            handlePrevious();
            break;
          }

          case arrowCode.right: {
            handleNext();
            break;
          }

          default: {
            break;
          }
        }
        return;
      }

      // arrow (volume)
      if (keyCode >= arrowCode.left && keyCode <= arrowCode.down) {
        if (!ytPlayerRef) return;

        const curVolume = await (ytPlayerRef as any).current.internalPlayer.getVolume();

        switch (keyCode) {
          case arrowCode.up: {
            if (curVolume >= 100) {
              return;
            }
            (ytPlayerRef as any).current.internalPlayer.setVolume(
              curVolume + 5
            );
            break;
          }

          case arrowCode.down: {
            if (curVolume <= 0) {
              return;
            }
            (ytPlayerRef as any).current.internalPlayer.setVolume(
              curVolume - 5
            );
            break;
          }

          default: {
            break;
          }
        }
        return;
      }
    },
    [
      handleBlur,
      handleNext,
      handlePause,
      handlePlay,
      handlePrevious,
      handleShuffleListToPlay,
      playing,
      ytPlayerRef,
    ]
  );

  // handle keyboard shortcuts for controlling player
  useKeyDown(playerKeyboardShortcuts);

  return {
    handlePrevious,
    handlePlay,
    handlePause,
    handleNext,
    handleShuffleListToPlay,
    handleToggleRepeat,

    // special purpose
    // for details please look at method docs
    handleBlur,
  };
};
