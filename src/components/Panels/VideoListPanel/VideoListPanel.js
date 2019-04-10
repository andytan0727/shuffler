import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";
import CloseIcon from "@material-ui/icons/Close";
import MusicVideoIcon from "@material-ui/icons/MusicVideo";
import { setCheckedPlaylists } from "../../../store/ytplaylist/action";
import SearchInput from "../../InputComponents/SearchInput";
import SearchPlaylistInput from "./SearchPlaylistInput";
import VideoListPanelBtnGroup from "../../ButtonComponents/VideoListPanelBtnGroup";
import VideoList from "../../ListComponents/VideoList";

import styles from "./styles.module.scss";

const VideoListPanel = (props) => {
  const {
    ytplaylist: { playlists, checkedPlaylists, playingPlaylists },
    setCheckedPlaylists,
  } = props;
  const [viewPlaylist, setViewPlaylist] = useState(false);
  const [playlistToView, setPlaylistToView] = useState([]);

  const handleSelectVideoItem = (e) => {
    const selectedPlaylistId = e.currentTarget.getAttribute("data-playlistid");
    const currentIndex = checkedPlaylists.indexOf(selectedPlaylistId);
    const newSelected = [...checkedPlaylists];

    if (currentIndex === -1) {
      newSelected.push(selectedPlaylistId);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setCheckedPlaylists(newSelected);
  };

  const handleCloseViewPlaylist = () => {
    setViewPlaylist(false);
    setCheckedPlaylists([]);
  };

  useEffect(() => {
    if (viewPlaylist && playlists.length) {
      setPlaylistToView(
        playlists.filter((playlist) => playlist.id === checkedPlaylists[0])[0]
          .items
      );
    }
  }, [viewPlaylist]);

  return (
    <React.Fragment>
      <div className={styles.videoListPanelDiv}>
        <SearchPlaylistInput name="search-playlist" placeholder="Playlist Url">
          {({ ref, ...playlistInputProps }) => (
            <SearchInput ref={ref} {...playlistInputProps} />
          )}
        </SearchPlaylistInput>
        <div className={styles.videoListItems}>
          {playlists.length !== 0 ? (
            playlists.map((playlist) => (
              <React.Fragment key={playlist.id}>
                <div
                  className={classNames(styles.videoListItem, {
                    [styles.checkedPlaylists]: checkedPlaylists.includes(
                      playlist.id
                    ),
                  })}
                  onClick={handleSelectVideoItem}
                  data-playlistid={playlist.id}
                >
                  <div>
                    {playingPlaylists.includes(playlist.id) && (
                      <MusicVideoIcon />
                    )}
                    <span>{playlist.name || `Playllist - ${playlist.id}`}</span>
                  </div>
                </div>
              </React.Fragment>
            ))
          ) : (
            <div>
              <h3>No Playlist Found</h3>
            </div>
          )}
        </div>

        <VideoListPanelBtnGroup setViewPlaylist={setViewPlaylist} />
      </div>
      {viewPlaylist && (
        <div className={styles.viewPlaylistDiv}>
          <button
            className={styles.closeButton}
            onClick={handleCloseViewPlaylist}
          >
            <CloseIcon />
          </button>
          {playlistToView.length ? (
            <VideoList items={playlistToView} height={450} />
          ) : (
            <h3>No Playlist</h3>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

VideoListPanel.propTypes = {
  ytplaylist: PropTypes.object.isRequired,
  setCheckedPlaylists: PropTypes.func.isRequired,
};

const mapStatesToVideoListPanelProps = ({ ytplaylist }) => ({
  ytplaylist,
});

export default connect(
  mapStatesToVideoListPanelProps,
  {
    setCheckedPlaylists,
  }
)(VideoListPanel);
