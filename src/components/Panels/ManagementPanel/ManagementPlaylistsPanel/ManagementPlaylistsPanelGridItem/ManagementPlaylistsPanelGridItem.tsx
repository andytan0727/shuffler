import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { PlaylistAddCheck as PlaylistAddCheckIcon } from "@material-ui/icons";
import { DeepReadonly } from "utility-types";

import { selectPlayingPlaylists } from "store/ytplaylist/selector";
import { Playlist } from "store/ytplaylist/types";
import { ManagementPlaylistsPanelGridItemBtn } from "components/Buttons";

import styles from "./styles.module.scss";

interface ManagementPlaylistsPanelGridItemProps {
  playlist: DeepReadonly<Playlist>;
}

const ManagementPlaylistsPanelGridItem = (
  props: ManagementPlaylistsPanelGridItemProps
) => {
  const { playlist } = props;
  const [enterPlaylist, setEnterPlaylist] = useState({});
  const playingPlaylists = useSelector(selectPlayingPlaylists);

  const thumbnails = playlist.items[0].snippet.thumbnails;

  const handlePlaylistMouseEnter = useCallback(
    (playlistId) => () =>
      setEnterPlaylist((prevState) => ({
        ...prevState,
        [playlistId]: true,
      })),
    []
  );

  const handlePlaylistMouseLeave = useCallback(
    (playlistId) => () =>
      setEnterPlaylist((prevState) => ({
        ...prevState,
        [playlistId]: false,
      })),
    []
  );

  return (
    <div key={playlist.id}>
      <li
        className={styles.gridItem}
        style={{
          backgroundImage: `url(${(thumbnails.high && thumbnails.high.url) ||
            thumbnails.default.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
        onMouseEnter={handlePlaylistMouseEnter(playlist.id)}
        onMouseLeave={handlePlaylistMouseLeave(playlist.id)}
      >
        {(enterPlaylist as PlainObject)[playlist.id] && (
          <ManagementPlaylistsPanelGridItemBtn playlistId={playlist.id} />
        )}
      </li>
      <div className={styles.gridItemTitle}>
        <h2>{playlist.name || `Playlist-${playlist.id}`}</h2>

        <div className={styles.gridItemTitleIcon}>
          {playingPlaylists.includes(playlist.id) && <PlaylistAddCheckIcon />}
        </div>
      </div>
    </div>
  );
};

export default ManagementPlaylistsPanelGridItem;
