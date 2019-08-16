import { PlayingPanelBtnGroup } from "components/Buttons";
import { CombinedPlaylist } from "components/Lists";
import React from "react";
import { useSelector } from "react-redux";
import { selectNormListToPlayResultSnippets } from "store/ytplaylist/listToPlaySelectors";

import styles from "./styles.module.scss";

const PlayingPanel = () => {
  const listToPlaySnippets = useSelector(selectNormListToPlayResultSnippets);

  return (
    <div className={styles.playingPanelDiv}>
      <h2
        className={styles.playingPanelTitle}
        data-totalsong={listToPlaySnippets.length}
      >
        Playing
      </h2>
      <CombinedPlaylist />
      <PlayingPanelBtnGroup />
    </div>
  );
};

export default PlayingPanel;
