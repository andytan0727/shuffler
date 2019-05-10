import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CloseIcon from "@material-ui/icons/Close";
import MusicVideoIcon from "@material-ui/icons/MusicVideo";
import SearchInput from "../../Inputs/SearchInput";
import SearchPlaylistInput from "../../Inputs/SearchPlaylistInput";
import VideoListPanelBtnGroup from "../../Buttons/VideoListPanelBtnGroup";
import VideoList from "../../Lists/VideoList";

import {
  setCheckedPlaylists,
  renamePlaylist,
} from "../../../store/ytplaylist/action";

import styles from "./styles.module.scss";

const VideoListPanel = (props) => {
  const {
    ytplaylist: { playlists, checkedPlaylists, playingPlaylists },
    setCheckedPlaylists,
    renamePlaylist,
  } = props;
  const [viewPlaylist, setViewPlaylist] = useState(false);
  const [playlistToView, setPlaylistToView] = useState([]);
  const [editName, setEditName] = useState({});

  const _checkPlaylist = (playlistId) => {
    const currentIndex = checkedPlaylists.indexOf(playlistId);
    const newSelected = [...checkedPlaylists];

    if (currentIndex === -1) {
      newSelected.push(playlistId);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setCheckedPlaylists(newSelected);
  };

  const handleCloseViewPlaylist = () => {
    setViewPlaylist(false);
    setCheckedPlaylists([]);
  };

  // on videoItem span child
  const handleDoubleClick = (e) => {
    const selectedPlaylistId = e.currentTarget.getAttribute("data-playlistid");
    setEditName({
      [selectedPlaylistId]: true,
    });
    _checkPlaylist(selectedPlaylistId);
  };

  const handleEditNameInputChange = (e) => {
    const playlistId = e.target.getAttribute("data-playlistid");
    renamePlaylist(e.target.value, playlistId);
  };

  const handleEditNameInputBlur = () => {
    setEditName({});
    setCheckedPlaylists([]);
  };

  const handleCheckPlaylists = (e) => {
    const selectedPlaylistId = e.target.value;
    _checkPlaylist(selectedPlaylistId);
  };

  // place on parent div
  const handleClick = (e) => {
    // obtain playlist id from span child
    const playlistId = Array.from(e.currentTarget.childNodes)[1].getAttribute(
      "data-playlistid"
    );
    _checkPlaylist(playlistId);
  };

  useEffect(() => {
    const input = document.querySelector('input[name="edit-name"]');
    if (Object.keys(editName).length && input) {
      input.focus();
    }
  }, [editName]);

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
                    {editName[playlist.id] ? (
                      <input
                        className={classNames(
                          styles.editNameInput,
                          `edit-name-${playlist.id}`
                        )}
                        name="edit-name"
                        value={playlist.name}
                        onChange={handleEditNameInputChange}
                        onBlur={handleEditNameInputBlur}
                        data-playlistid={playlist.id}
                      />
                    ) : (
                      <span
                        onDoubleClick={handleDoubleClick}
                        data-playlistid={playlist.id}
                      >
                        {playlist.name || `Playlist - ${playlist.id}`}
                      </span>
                    )}
                    {playingPlaylists.includes(playlist.id) && (
                      <MusicVideoIcon />
                    )}
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
  renamePlaylist: PropTypes.func.isRequired,
};

const mapStatesToVideoListPanelProps = ({ ytplaylist }) => ({
  ytplaylist,
});

export default connect(
  mapStatesToVideoListPanelProps,
  {
    setCheckedPlaylists,
    renamePlaylist,
  }
)(VideoListPanel);
