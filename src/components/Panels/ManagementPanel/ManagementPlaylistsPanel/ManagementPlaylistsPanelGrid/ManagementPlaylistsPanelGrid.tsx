import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { IconButton, Tooltip } from "@material-ui/core";
import {
  PlayArrow as PlayArrowIcon,
  Shuffle as ShuffleIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon,
} from "@material-ui/icons";
import {
  playingPlaylistsSelector,
  playlistsSelector,
} from "store/ytplaylist/selector";

import styles from "./styles.module.scss";

interface ManagementPlaylistsPanelGridItemBtnProps {
  playlistId: string;
}

/**
 * ManagementPlaylistsPanelGridItemBtn component
 *
 * Button group for grid item
 *
 */
const ManagementPlaylistsPanelGridItemBtn = (
  props: ManagementPlaylistsPanelGridItemBtnProps
) => {
  const { playlistId } = props;
  const playingPlaylists = useSelector(playingPlaylistsSelector);

  return (
    <div>
      <Tooltip title="Play">
        <IconButton>
          <PlayArrowIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Shuffle">
        <IconButton>
          <ShuffleIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      {playingPlaylists.includes(playlistId) ? (
        <Tooltip title="Remove Playlist from Now Playing">
          <IconButton>
            <RemoveIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add Playlist to Now Playing">
          <IconButton>
            <AddIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Delete">
        <IconButton>
          <DeleteIcon fontSize="large" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const ManagementPlaylistsPanelGrid = () => {
  const playlists = useSelector(playlistsSelector);
  const playingPlaylists = useSelector(playingPlaylistsSelector);
  const [enterPlaylist, setEnterPlaylist] = useState({});

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
    <div className={styles.panelGridDiv}>
      <ul className={styles.panelGrid}>
        {playlists.map((playlist) => {
          const thumbnails = playlist.items[0].snippet.thumbnails;

          return (
            <div key={playlist.id}>
              <li
                className={styles.gridItem}
                style={{
                  backgroundImage: `url(${(thumbnails.high &&
                    thumbnails.high.url) ||
                    thumbnails.default.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                }}
                onMouseEnter={handlePlaylistMouseEnter(playlist.id)}
                onMouseLeave={handlePlaylistMouseLeave(playlist.id)}
              >
                {(enterPlaylist as PlainObject)[playlist.id] && (
                  <ManagementPlaylistsPanelGridItemBtn
                    playlistId={playlist.id}
                  />
                )}
              </li>
              <div className={styles.gridItemTitle}>
                <h2>{playlist.name || `Playlist-${playlist.id}`}</h2>

                <div className={styles.gridItemTitleIcon}>
                  {playingPlaylists.includes(playlist.id) && (
                    <PlaylistAddCheckIcon />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default ManagementPlaylistsPanelGrid;
