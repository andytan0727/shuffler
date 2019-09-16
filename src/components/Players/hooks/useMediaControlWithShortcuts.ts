import { useCallback } from "react";
import { useSelector } from "react-redux";
import YouTube from "react-youtube";
import { selectPlaying } from "store/ytplayer/selector";
import { useKeyDown } from "utils/helper/keyboardShortcutHelper";

import { useMediaControl } from "./useMediaControl";

const arrowCode = { left: 37, up: 38, right: 39, down: 40 };

// fix play/pause problem when Spacebar is pressed after clicking buttons
export const handleBlur = (e: React.KeyboardEvent) => {
  (e.target as HTMLBodyElement).blur();
};

/**
 * Keyboard shortcut to increase volume by a factor of 5
 * using up or down arrow key
 *
 * @param keyCode Key code
 * @param ytPlayerRef Ref of YouTube
 */
const volumeShortcut = async (
  keyCode: number,
  ytPlayerRef: React.Ref<YouTube>
) => {
  if (!ytPlayerRef) return;

  const curVolume = await (ytPlayerRef as any).current.internalPlayer.getVolume();

  switch (keyCode) {
    case arrowCode.up:
      if (curVolume >= 100) break;

      (ytPlayerRef as any).current.internalPlayer.setVolume(curVolume + 5);
      break;

    case arrowCode.down:
      if (curVolume <= 0) break;

      (ytPlayerRef as any).current.internalPlayer.setVolume(curVolume - 5);
      break;

    default:
      break;
  }
};

/**
 * provide keyboard shortcuts in addition to the media
 * control handlers from useMediaControl hook
 *
 * @param ytPlayerRef Ref of YouTube
 * @returns Media control handlers from useMediaControl hook
 */
export const useMediaControlWithShortcuts = (
  ytPlayerRef: React.Ref<YouTube>
) => {
  const mediaControl = useMediaControl(ytPlayerRef);
  const playing = useSelector(selectPlaying);

  const playPauseShortcut = useCallback(() => {
    if (playing) {
      mediaControl.handlePause();
    } else {
      mediaControl.handlePlay();
    }
  }, [mediaControl, playing]);

  const shortcuts = useCallback(
    async (e: React.KeyboardEvent) => {
      const keyCode = e.keyCode;
      const isSpaceKey =
        keyCode === 32 || (e as any).keyC === " " || e.key === "Spacebar";
      const isCtrlKey = e.ctrlKey;
      const isCtrlAltS = e.ctrlKey && e.altKey && e.key === "s";

      // SpaceKey (play, pause)
      if (isSpaceKey) {
        // blur anything else to prevent Spacebar bugs
        handleBlur(e);

        return playPauseShortcut();
      }

      // Ctrl (shuffle, prev, next)
      if (isCtrlKey) {
        // ctrl+alt+s (shuffle playing list)
        if (isCtrlAltS) {
          mediaControl.handleShuffleListToPlay();
          return;
        }

        // ctrl + arrow left/right (fast forward/backward)
        switch (keyCode) {
          case arrowCode.left:
            mediaControl.handlePrevious();
            break;

          case arrowCode.right:
            mediaControl.handleNext();
            break;

          default:
            break;
        }

        return;
      }

      // arrows (volume)
      await volumeShortcut(keyCode, ytPlayerRef);
    },
    [mediaControl, playPauseShortcut, ytPlayerRef]
  );

  // handle keyboard shortcuts for controlling player
  useKeyDown(shortcuts);

  return mediaControl;
};
