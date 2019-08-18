import { VideoListPanelBtnGroup } from "components/Buttons";
import { useCheckbox } from "components/Checkbox/hooks";
import { makeSearchInput } from "components/Inputs";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { selectNormPlaylistsResult } from "store/ytplaylist/playlistSelectors";

import styles from "./styles.module.scss";
import VideoListPanelItem from "./VideoListPanelItem";
import ViewPlaylistPanel from "./ViewPlaylistPanel";

const SearchPlaylistInput = makeSearchInput("playlists");

const VideoListPanel = () => {
  const [viewPlaylist, setViewPlaylist] = useState(false);
  const playlistIds = useSelector(selectNormPlaylistsResult);
  const { checked, handleCheckOrUncheckId, clearChecked } = useCheckbox();

  const handleCloseViewPlaylist = useCallback(() => {
    setViewPlaylist(false);
    clearChecked();
  }, [clearChecked]);

  return (
    <React.Fragment>
      <div className={styles.videoListPanelDiv}>
        <SearchPlaylistInput />
        <div className={styles.videoListItems}>
          {playlistIds.length !== 0 ? (
            playlistIds.map((playlistId) => (
              <React.Fragment key={playlistId}>
                <VideoListPanelItem
                  playlistId={playlistId}
                  checked={checked}
                  handleCheckOrUncheckId={handleCheckOrUncheckId}
                />
                {viewPlaylist && (
                  <ViewPlaylistPanel
                    playlistId={playlistId}
                    handleCloseViewPlaylist={handleCloseViewPlaylist}
                  />
                )}
              </React.Fragment>
            ))
          ) : (
            <div>
              <h3
                style={{
                  textAlign: "center",
                }}
              >
                No Playlist Found
              </h3>
            </div>
          )}
        </div>

        <VideoListPanelBtnGroup
          checked={checked}
          clearChecked={clearChecked}
          setViewPlaylist={setViewPlaylist}
        />
      </div>
    </React.Fragment>
  );
};

export default VideoListPanel;
