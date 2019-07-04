import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";

// Material Components
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CloseIcon from "@material-ui/icons/Close";
import MusicVideoIcon from "@material-ui/icons/MusicVideo";

import { VideoListPanelBtnGroup } from "../../Buttons";
import { SearchInput, SearchPlaylistInput, RenameInput } from "../../Inputs";
import { VideoList } from "../../Lists";

import { setCheckedPlaylistsAction } from "../../../store/ytplaylist/action";

import styles from "./styles.module.scss";

const VideoListPanel = (props) => {
  const {
    ytplaylist: { playlists, checkedPlaylists, playingPlaylists },
    setCheckedPlaylistsAction,
  } = props;
  const [viewPlaylist, setViewPlaylist] = useState(false);
  const [playlistToView, setPlaylistToView] = useState([]);

  const _checkPlaylist = (playlistId) => {
    const currentIndex = checkedPlaylists.indexOf(playlistId);
    const newSelected = [...checkedPlaylists];

    if (currentIndex === -1) {
      newSelected.push(playlistId);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setCheckedPlaylistsAction(newSelected);
  };

  const handleCloseViewPlaylist = () => {
    setViewPlaylist(false);
    setCheckedPlaylistsAction([]);
  };

  const handleCheckPlaylists = (e) => {
    // stop event bubbling to parent div and checks checkbox twice
    e.stopPropagation();

    const selectedPlaylistId = e.target.value;
    _checkPlaylist(selectedPlaylistId);
  };

  // place on parent div
  const handleClick = (e) => {
    // stop event delegation to checkbox
    e.stopPropagation();

    // obtain playlist id from span child
    const playlistId = Array.from(e.currentTarget.childNodes)[1].getAttribute(
      "data-playlistid"
    );
    _checkPlaylist(playlistId);
  };

  useEffect(() => {
    if (viewPlaylist && playlists.length) {
      setPlaylistToView(
        playlists.filter((playlist) => playlist.id === checkedPlaylists[0])[0]
          .items
      );
    }
  }, [checkedPlaylists, playlists, viewPlaylist]);

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
                >
                  <div onClick={handleClick}>
                    <Checkbox
                      className={styles.checkBox}
                      checked={checkedPlaylists.includes(playlist.id)}
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      value={playlist.id}
                      onChange={handleCheckPlaylists}
                    />
                    <RenameInput id={playlist.id} name={playlist.name} />
                    {playingPlaylists.includes(playlist.id) && (
                      <MusicVideoIcon />
                    )}
                  </div>
                </div>
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
            // @ts-ignore
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
  setCheckedPlaylistsAction: PropTypes.func.isRequired,
};

const mapStatesToVideoListPanelProps = ({ ytplaylist }) => ({
  ytplaylist,
});

export default connect(
  mapStatesToVideoListPanelProps,
  {
    setCheckedPlaylistsAction,
  }
)(VideoListPanel);
