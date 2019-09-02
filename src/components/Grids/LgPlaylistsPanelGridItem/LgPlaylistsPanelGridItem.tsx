import { LgPlaylistsPanelGridItemBtnGroup } from "components/Buttons";
import {
  AllPlaylistInPlayingIcon,
  PartialPlaylistInPlayingIcon,
} from "components/Icons";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "store";
import {
  selectPlaylistById,
  selectPlaylistSnippetByItemId,
} from "store/ytplaylist/playlistSelectors";

import styles from "./styles.module.scss";

interface LgPlaylistsPanelGridItemProps {
  playlistId: string;
}

const LgPlaylistsPanelGridItem = (props: LgPlaylistsPanelGridItemProps) => {
  const { playlistId } = props;
  const [enterPlaylist, setEnterPlaylist] = useState({});
  const playlist = useSelector((state: AppState) =>
    selectPlaylistById(state, playlistId)
  );
  const firstSnippet = useSelector((state: AppState) =>
    selectPlaylistSnippetByItemId(state, playlist.items[0])
  );
  const { allInPlaying, partialInPlaying, name: playlistName } = playlist;

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
          <LgPlaylistsPanelGridItemBtnGroup playlistId={playlistId} />
        )}
      </li>
      <div className={styles.gridItemTitleDiv}>
        <h2 className={styles.gridItemTitle}>
          {playlistName || `Playlist-${playlistId}`}
        </h2>

        <div className={styles.gridItemTitleIcon}>
          {allInPlaying ? (
            <AllPlaylistInPlayingIcon />
          ) : partialInPlaying ? (
            <PartialPlaylistInPlayingIcon />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LgPlaylistsPanelGridItem;
