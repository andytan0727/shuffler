import React from "react";
import { useSelector } from "react-redux";
import { selectPlaylists } from "store/ytplaylist/selector";
import ManagementPlaylistsPanelGridItem from "components/Grids/ManagementPlaylistsPanelGridItem";

import styles from "./styles.module.scss";

const ManagementPlaylistsPanelGrid = () => {
  const playlists = useSelector(selectPlaylists);

  return (
    <div className={styles.panelGridDiv}>
      <ul className={styles.panelGrid}>
        {playlists.map((playlist) => {
          return (
            <ManagementPlaylistsPanelGridItem
              key={playlist.id}
              playlist={playlist}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default ManagementPlaylistsPanelGrid;
