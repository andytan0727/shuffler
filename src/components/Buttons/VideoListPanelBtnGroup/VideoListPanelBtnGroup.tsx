import React, { useCallback } from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ViewList as ViewListIcon,
} from "@material-ui/icons";
import { AppState } from "store";
import {
  addPlaylistsToListToPlayAction,
  deletePlaylistsAction,
  removePlaylistsFromListToPlayAction,
} from "store/ytplaylist/action";
import { generateCustomSwal, notify } from "utils/helper/notifyHelper";

import styles from "./styles.module.scss";

interface VideoListPanelBtnGroupConnectedState {
  preferDarkTheme: boolean;
  checkedPlaylists: Readonly<string[]>;
}

interface VideoListPanelBtnGroupConnectedDispatch {
  addPlaylistsToListToPlayAction: typeof addPlaylistsToListToPlayAction;
  deletePlaylistsAction: typeof deletePlaylistsAction;
  removePlaylistsFromListToPlayAction: typeof removePlaylistsFromListToPlayAction;
}

interface VideoListPanelBtnGroupOwnProps {
  setViewPlaylist: (arg0: boolean) => void;
}

type VideoListPanelBtnGroupProps = VideoListPanelBtnGroupOwnProps &
  VideoListPanelBtnGroupConnectedState &
  VideoListPanelBtnGroupConnectedDispatch;

const noPlaylistSelectedAlert = async () => {
  const customSwal = await generateCustomSwal();
  await customSwal!.fire({
    title: "No playlist is selected!💢",
    text: "Please select at least one playlist!",
    type: "warning",
  });
};

const VideoListPanelBtnGroup = (props: VideoListPanelBtnGroupProps) => {
  const {
    preferDarkTheme,
    checkedPlaylists,
    addPlaylistsToListToPlayAction,
    deletePlaylistsAction,
    removePlaylistsFromListToPlayAction,
    setViewPlaylist,
  } = props;

  const handleAddPlaylistToPlaying = useCallback(async () => {
    if (!checkedPlaylists.length) {
      await noPlaylistSelectedAlert();
      return;
    }

    addPlaylistsToListToPlayAction(checkedPlaylists as string[]);

    notify("success", "Successfully added selected playlist(s) to playing 😎");
  }, [addPlaylistsToListToPlayAction, checkedPlaylists]);

  const handleRemovePlaylistFromPlaying = useCallback(async () => {
    if (!checkedPlaylists.length) {
      await noPlaylistSelectedAlert();
      return;
    }

    removePlaylistsFromListToPlayAction(checkedPlaylists as string[]);
  }, [checkedPlaylists, removePlaylistsFromListToPlayAction]);

  const handleRemovePlaylist = useCallback(async () => {
    const customSwal = await generateCustomSwal();

    if (!checkedPlaylists.length) {
      await noPlaylistSelectedAlert();
      return;
    }

    const result = await customSwal!.fire({
      title: "Remove playlist",
      text: "Are you sure?🤔",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it please!🔥",
      cancelButtonText: "No!!!😱",
    });

    if (result.value) {
      deletePlaylistsAction(checkedPlaylists as string[]);
      notify("success", "Successfully deleted playlist(s) 😎");
    }
  }, [checkedPlaylists, deletePlaylistsAction]);

  const handleViewPlaylist = useCallback(async () => {
    const customSwal = await generateCustomSwal();

    if (!checkedPlaylists.length) {
      await noPlaylistSelectedAlert();
      return;
    }

    if (checkedPlaylists.length > 1) {
      await customSwal!.fire({
        title: "You can only view one playlist at once",
        text: "Please select only one playlist!",
        type: "warning",
      });
      return;
    }

    setViewPlaylist(true);
  }, [checkedPlaylists.length, setViewPlaylist]);

  return (
    <div
      className={classNames({
        [styles.btnGroupDark]: preferDarkTheme,
        [styles.btnGroupLight]: !preferDarkTheme,
      })}
    >
      <button
        onClick={handleAddPlaylistToPlaying}
        data-tooltip={"Add to playing"}
      >
        <AddIcon />
      </button>
      <button
        onClick={handleRemovePlaylistFromPlaying}
        data-tooltip={"Remove from playing"}
      >
        <RemoveIcon />
      </button>
      <button onClick={handleRemovePlaylist} data-tooltip={"Remove playlist"}>
        <DeleteIcon />
      </button>
      <button onClick={handleViewPlaylist} data-tooltip={"View playlist"}>
        <ViewListIcon />
      </button>
    </div>
  );
};

const mapStatesToProps = ({
  userPreferences: { preferDarkTheme },
  ytplaylist: { checkedPlaylists },
}: AppState) => ({
  preferDarkTheme,
  checkedPlaylists,
});

export default connect(
  mapStatesToProps,
  {
    addPlaylistsToListToPlayAction,
    deletePlaylistsAction,
    removePlaylistsFromListToPlayAction,
  }
)(VideoListPanelBtnGroup);
