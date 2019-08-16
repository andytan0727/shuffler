import { ManagementPlaylistsPanelGridItemBtn } from "components/Buttons";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "store";
import {
  selectNormPlaylistAllInPlayingById,
  selectNormPlaylistById,
  selectNormPlaylistNameById,
  selectNormPlaylistSnippetByItemId,
} from "store/ytplaylist/playlistSelectors";

import { PlaylistAddCheck as PlaylistAddCheckIcon } from "@material-ui/icons";

import styles from "./styles.module.scss";

interface ManagementPlaylistsPanelGridItemProps {
  playlistId: string;
}

const ManagementPlaylistsPanelGridItem = (
  props: ManagementPlaylistsPanelGridItemProps
) => {
  const { playlistId } = props;
  const [enterPlaylist, setEnterPlaylist] = useState({});
  const playlist = useSelector((state: AppState) =>
    selectNormPlaylistById(state, playlistId)
  );
  const firstSnippet = useSelector((state: AppState) =>
    selectNormPlaylistSnippetByItemId(state, playlist.items[0])
  );
  const playlistName = useSelector((state: AppState) =>
    selectNormPlaylistNameById(state, playlistId)
  );
  const allInPlaying = useSelector((state: AppState) =>
    selectNormPlaylistAllInPlayingById(state, playlistId)
  );

  const thumbnails = firstSnippet && firstSnippet.thumbnails;

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
    <div key={playlistId}>
      <li
        className={styles.gridItem}
        style={{
          backgroundImage:
            thumbnails &&
            `url(${(thumbnails.high && thumbnails.high.url) ||
              thumbnails.default.url})`,
          backgroundColor: "white",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
        onMouseEnter={handlePlaylistMouseEnter(playlistId)}
        onMouseLeave={handlePlaylistMouseLeave(playlistId)}
      >
        {(enterPlaylist as PlainObject)[playlistId] && (
          <ManagementPlaylistsPanelGridItemBtn playlistId={playlistId} />
        )}
      </li>
      <div className={styles.gridItemTitleDiv}>
        <h2 className={styles.gridItemTitle}>
          {playlistName || `Playlist-${playlistId}`}
        </h2>

        <div className={styles.gridItemTitleIcon}>
          {allInPlaying && <PlaylistAddCheckIcon />}
        </div>
      </div>
    </div>
  );
};

export default ManagementPlaylistsPanelGridItem;
