import classNames from "classnames";
import { VideoListPanelBtnGroup } from "components/Buttons";
import { makeSearchInput, RenameInput } from "components/Inputs";
import { VideoList } from "components/Lists";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { AppState } from "store";
import { setCheckedPlaylistsAction } from "store/ytplaylist/action";
import {
  DeepROYtPlaylistState,
  PlaylistItemSnippet,
} from "store/ytplaylist/types";
import { DeepReadonly } from "utility-types";
import { addOrRemove } from "utils/helper/arrayHelper";

import { Checkbox } from "@material-ui/core";
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Close as CloseIcon,
  MusicVideo as MusicVideoIcon,
} from "@material-ui/icons";

import styles from "./styles.module.scss";

interface VideoListPanelConnectedState {
  ytplaylist: DeepROYtPlaylistState;
}

interface VideoListPanelConnectedDispatch {
  setCheckedPlaylistsAction: typeof setCheckedPlaylistsAction;
}

type VideoListPanelProps = VideoListPanelConnectedState &
  VideoListPanelConnectedDispatch;

const SearchPlaylistInput = makeSearchInput("playlists");

const VideoListPanel = (props: VideoListPanelProps) => {
  const {
    ytplaylist: { playlists, checkedPlaylists, playingPlaylists },
    setCheckedPlaylistsAction,
  } = props;
  const [viewPlaylist, setViewPlaylist] = useState(false);
  const [playlistToView, setPlaylistToView] = useState([] as DeepReadonly<
    PlaylistItemSnippet[]
  >);

  const handleCheckPlaylists = useCallback(
    (id) => (e: OnClickEvent | InputChangeEvent) => {
      // stop event bubbling to parent div and checks checkbox twice
      e.stopPropagation();

      setCheckedPlaylistsAction(addOrRemove(checkedPlaylists as string[], id));
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
        playlists
          .filter((playlist) => playlist.id === checkedPlaylists[0])[0]
          .items.flatMap((item) => item.snippet)
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
            <VideoList items={playlistToView} height={450} />
          ) : (
            <h3>No Playlist</h3>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

const mapStatesToProps = ({ ytplaylist }: AppState) => ({
  ytplaylist,
});

export default connect(
  mapStatesToProps,
  {
    setCheckedPlaylistsAction,
  }
)(VideoListPanel);
