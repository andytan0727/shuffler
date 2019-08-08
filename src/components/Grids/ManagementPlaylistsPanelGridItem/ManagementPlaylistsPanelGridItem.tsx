import { ManagementPlaylistsPanelGridItemBtn } from "components/Buttons";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectNormPlaylistById,
  selectNormPlaylistSnippetByItemId,
} from "store/ytplaylist/normSelector";

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
  const playlist = useSelector((state: never) =>
    selectNormPlaylistById(state, playlistId)
  );
  const firstSnippet = useSelector((state: never) =>
    selectNormPlaylistSnippetByItemId(state, playlist.items[0])
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
          {playlist.name || `Playlist-${playlistId}`}
        </h2>

        <div className={styles.gridItemTitleIcon}>
          {playlist.allInPlaying && <PlaylistAddCheckIcon />}
        </div>
      </div>
    </div>
  );
};

export default ManagementPlaylistsPanelGridItem;
