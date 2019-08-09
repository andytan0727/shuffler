import classNames from "classnames";
import React, { useCallback } from "react";
import { connect, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { selectPreferDarkTheme } from "store/userPreferences/selector";
import { selectNormListToPlayResultSnippets } from "store/ytplaylist/normSelector";
import {
  clearListToPlayAction,
  shuffleListToPlayAction,
} from "store/ytplaylist/sharedAction";
import { generateCustomSwal, notify } from "utils/helper/notifyHelper";

import {
  Clear as ClearIcon,
  PlayArrow as PlayArrowIcon,
  Shuffle as ShuffleIcon,
} from "@material-ui/icons";

import styles from "./styles.module.scss";

interface PlayingPanelBtnGroupConnectedDispatch {
  clearListToPlayAction: typeof clearListToPlayAction;
  shuffleListToPlayAction: typeof shuffleListToPlayAction;
}

type PlayingPanelBtnGroupOwnProps = RouteComponentProps;

type PlayingPanelBtnGroupProps = PlayingPanelBtnGroupOwnProps &
  PlayingPanelBtnGroupConnectedDispatch;

const PlayingPanelBtnGroup = (props: PlayingPanelBtnGroupProps) => {
  const { history, clearListToPlayAction, shuffleListToPlayAction } = props;
  const listToPlaySnippets = useSelector(selectNormListToPlayResultSnippets);
  const preferDarkTheme = useSelector(selectPreferDarkTheme);

  const handleRedirectToPlayer = useCallback(() => {
    if (listToPlaySnippets.length === 0) {
      notify(
        "warning",
        "💢 Please don't proceed to player with an empty playing list!"
      );
      return;
    }

    history.push("/player/ytplayer");
  }, [history, listToPlaySnippets.length]);

  const handleClearListToPlay = useCallback(async () => {
    const customSwal = await generateCustomSwal();

    const result = await customSwal!.fire({
      title: "Clear playing list",
      text: "Are you sure?🤔",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear it please!🔥",
      cancelButtonText: "No!!!😱",
    });

    if (result.value) {
      clearListToPlayAction();
      notify("success", "Successfully cleared playing playlist! 😎");
    }
  }, [clearListToPlayAction]);

  return (
    <div
      className={classNames({
        [styles.playingPanelBtnGroupLight]: !preferDarkTheme,
        [styles.playingPanelBtnGroupDark]: preferDarkTheme,
      })}
    >
      <button onClick={handleRedirectToPlayer} data-tooltip="Play">
        <PlayArrowIcon />
      </button>
      <button
        onClick={shuffleListToPlayAction}
        data-tooltip="Shuffle playing list"
      >
        <ShuffleIcon />
      </button>
      <button onClick={handleClearListToPlay} data-tooltip="Clear playing list">
        <ClearIcon />
      </button>
    </div>
  );
};

export default connect(
  null,
  {
    clearListToPlayAction,
    shuffleListToPlayAction,
  }
)(withRouter(PlayingPanelBtnGroup));
