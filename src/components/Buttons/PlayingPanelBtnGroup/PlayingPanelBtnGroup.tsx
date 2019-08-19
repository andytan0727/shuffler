import classNames from "classnames";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { selectPreferDarkTheme } from "store/userPreferences/selector";
import {
  clearListToPlayAction,
  shuffleListToPlayAction,
} from "store/ytplaylist/listToPlayActions";
import { selectListToPlayResultSnippets } from "store/ytplaylist/listToPlaySelectors";
import { generateCustomSwal, notify } from "utils/helper/notifyHelper";

import {
  Clear as ClearIcon,
  PlayArrow as PlayArrowIcon,
  Shuffle as ShuffleIcon,
} from "@material-ui/icons";

import styles from "./styles.module.scss";

const PlayingPanelBtnGroup = (props: RouteComponentProps) => {
  const { history } = props;
  const listToPlaySnippets = useSelector(selectListToPlayResultSnippets);
  const preferDarkTheme = useSelector(selectPreferDarkTheme);
  const dispatch = useDispatch();

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

  const handleShuffleListToPlay = useCallback(() => {
    dispatch(shuffleListToPlayAction());
  }, [dispatch]);

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
      dispatch(clearListToPlayAction());
      notify("success", "Successfully cleared playing playlist! 😎");
    }
  }, [dispatch]);

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
        onClick={handleShuffleListToPlay}
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

export default withRouter(PlayingPanelBtnGroup);
