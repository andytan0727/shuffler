import { VideoListPanelBtnGroup } from "components/Buttons";
import { useCheckbox } from "components/Checkbox/hooks";
import { makeSearchInput } from "components/Inputs";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectListToPlayTotalItems } from "store/ytplaylist/listToPlaySelectors";
import { selectPlaylistsResult } from "store/ytplaylist/playlistSelectors";

import styles from "./styles.module.scss";
import VideoListPanelItem from "./VideoListPanelItem";
import ViewPlaylistPanel from "./ViewPlaylistPanel";

const SearchPlaylistInput = makeSearchInput("playlists");

const VideoListPanel = () => {
  const [viewPlaylist, setViewPlaylist] = useState(false);
  const playlistIds = useSelector(selectPlaylistsResult);
  const { checked, handleCheckOrUncheckId, clearChecked } = useCheckbox();

  // use to detect listToPlay changes when add/remove
  // playlist to/from playing action dispatched
  const listToPlayTotalItems = useSelector(selectListToPlayTotalItems);

  const handleCloseViewPlaylist = useCallback(() => {
    setViewPlaylist(false);
    clearChecked();
  }, [clearChecked]);

  // clear checked when listToPlay/playlist changes
  useEffect(() => {
    clearChecked();
  }, [clearChecked, listToPlayTotalItems, playlistIds]);

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
