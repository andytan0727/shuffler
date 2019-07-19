import React from "react";
import { connect } from "react-redux";
import { CombinedPlaylist } from "components/Lists";
import { PlayingPanelBtnGroup } from "components/Buttons";
import { AppState } from "store";
import { ListToPlayItems } from "store/ytplaylist/types";
import { selectListToPlay } from "store/ytplaylist/selector";

import styles from "./styles.module.scss";

interface PlayingPanelConnectedState {
  listToPlay: ListToPlayItems;
}

type PlayingPanelProps = PlayingPanelConnectedState;

const PlayingPanel = (props: PlayingPanelProps) => {
  const { listToPlay } = props;

  return (
    <div className={styles.playingPanelDiv}>
      <h2
        className={styles.playingPanelTitle}
        data-totalsong={listToPlay.length}
      >
        Playing
      </h2>
      <CombinedPlaylist />
      <PlayingPanelBtnGroup />
    </div>
  );
};

const mapStatesToProps = (state: AppState) => ({
  listToPlay: selectListToPlay(state),
});

export default connect(
  mapStatesToProps,
  {}
)(PlayingPanel);
