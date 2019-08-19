import ManagementPlaylistsPanelGridItem from "components/Grids/ManagementPlaylistsPanelGridItem";
import React from "react";
import { useSelector } from "react-redux";
import { selectPlaylistsResult } from "store/ytplaylist/playlistSelectors";

import styles from "./styles.module.scss";

const ManagementPlaylistsPanelGrid = () => {
  const playlistIds = useSelector(selectPlaylistsResult);

  return (
    <div className={styles.panelGridDiv}>
      <ul className={styles.panelGrid}>
        {playlistIds.map((playlistId) => {
          return (
            <ManagementPlaylistsPanelGridItem
              key={playlistId}
              playlistId={playlistId}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default ManagementPlaylistsPanelGrid;
