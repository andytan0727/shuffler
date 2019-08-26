import LgPlaylistsPanelGridItem from "components/Grids/LgPlaylistsPanelGridItem";
import React from "react";
import { useSelector } from "react-redux";
import { selectPlaylistsResult } from "store/ytplaylist/playlistSelectors";

import styles from "./styles.module.scss";

const LgPlaylistsPanelGrid = () => {
  const playlistIds = useSelector(selectPlaylistsResult);

  return (
    <div className={styles.panelGridDiv}>
      <ul className={styles.panelGrid}>
        {playlistIds.map((playlistId) => {
          return (
            <LgPlaylistsPanelGridItem
              key={playlistId}
              playlistId={playlistId}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default LgPlaylistsPanelGrid;
