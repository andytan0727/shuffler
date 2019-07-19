import React, { useState, useEffect, useCallback } from "react";
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
import { makeSearchInput, RenameInput } from "../../Inputs";
import { VideoList } from "../../Lists";
import { setCheckedPlaylistsAction } from "../../../store/ytplaylist/action";
import { addOrRemove } from "../../../utils/helper/arrayHelper";

import styles from "./styles.module.scss";

const SearchPlaylistInput = makeSearchInput("playlists");

const VideoListPanel = (props) => {
  const {
    ytplaylist: { playlists, checkedPlaylists, playingPlaylists },
    setCheckedPlaylistsAction,
  } = props;
  const [viewPlaylist, setViewPlaylist] = useState(false);
  const [playlistToView, setPlaylistToView] = useState([]);

  const handleCheckPlaylists = useCallback(
    (id) => (e) => {
      // stop event bubbling to parent div and checks checkbox twice
      e.stopPropagation();

      setCheckedPlaylistsAction(addOrRemove(checkedPlaylists, id));
    },
    [checkedPlaylists, setCheckedPlaylistsAction]
  );

  const handleCloseViewPlaylist = useCallback(() => {
    setViewPlaylist(false);
    setCheckedPlaylistsAction([]);
  }, [setCheckedPlaylistsAction]);

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
        <SearchPlaylistInput />
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
                  <div onClick={handleCheckPlaylists(playlist.id)}>
                    <Checkbox
                      className={styles.checkBox}
                      checked={checkedPlaylists.includes(playlist.id)}
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      onChange={handleCheckPlaylists(playlist.id)}
                    />
                    <RenameInput id={playlist.id} />
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
