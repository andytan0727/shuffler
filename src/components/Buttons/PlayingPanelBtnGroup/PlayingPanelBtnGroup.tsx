import classNames from "classnames";
import React, { useCallback } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { AppState } from "store";
import {
  clearListToPlayAction,
  shuffleListToPlayAction,
} from "store/ytplaylist/sharedAction";
import { ListToPlayItems } from "store/ytplaylist/types";
import { generateCustomSwal, notify } from "utils/helper/notifyHelper";

import {
  Clear as ClearIcon,
  PlayArrow as PlayArrowIcon,
  Shuffle as ShuffleIcon,
} from "@material-ui/icons";

import styles from "./styles.module.scss";

interface PlayingPanelBtnGroupConnectedState {
  preferDarkTheme: boolean;
  listToPlay: ListToPlayItems;
}

interface PlayingPanelBtnGroupConnectedDispatch {
  clearListToPlayAction: typeof clearListToPlayAction;
  shuffleListToPlayAction: typeof shuffleListToPlayAction;
}

type PlayingPanelBtnGroupOwnProps = RouteComponentProps;

type PlayingPanelBtnGroupProps = PlayingPanelBtnGroupOwnProps &
  PlayingPanelBtnGroupConnectedState &
  PlayingPanelBtnGroupConnectedDispatch;

const PlayingPanelBtnGroup = (props: PlayingPanelBtnGroupProps) => {
  const {
    preferDarkTheme,
    listToPlay,
    history,
    clearListToPlayAction,
    shuffleListToPlayAction,
  } = props;

  const handleRedirectToPlayer = useCallback(() => {
    if (!listToPlay.length) {
      notify(
        "warning",
        "💢 Please don't proceed to player with no playing list!"
      );
      return;
    }

    history.push("/player/ytplayer");
  }, [history, listToPlay.length]);

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

const mapStatesToProps = ({
  userPreferences: { preferDarkTheme },
  ytplaylist: { listToPlay },
}: AppState) => ({
  preferDarkTheme,
  listToPlay,
});

export default connect(
  mapStatesToProps,
  {
    clearListToPlayAction,
    shuffleListToPlayAction,
  }
)(withRouter(PlayingPanelBtnGroup));
