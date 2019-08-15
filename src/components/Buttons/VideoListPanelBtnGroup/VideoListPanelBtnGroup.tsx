import classNames from "classnames";
import { ClearChecked } from "components/Checkbox/hooks";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPreferDarkTheme } from "store/userPreferences/selector";
import {
  addPlaylistsToListToPlayAction,
  deletePlaylistsAction,
  removePlaylistsFromListToPlayAction,
} from "store/ytplaylist/action";
import {
  addNormPlaylistToNormListToPlayAction,
  deleteNormPlaylistByIdAction,
  removeNormPlaylistsFromNormListToPlayAction,
} from "store/ytplaylist/normAction";
import { generateCustomSwal, notify } from "utils/helper/notifyHelper";

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Remove as RemoveIcon,
  ViewList as ViewListIcon,
} from "@material-ui/icons";

import styles from "./styles.module.scss";

interface VideoListPanelBtnGroupOwnProps {
  checked: string[];
  clearChecked: ClearChecked;
  setViewPlaylist: (arg0: boolean) => void;
}

type VideoListPanelBtnGroupProps = VideoListPanelBtnGroupOwnProps;

const noPlaylistSelectedAlert = async () => {
  const customSwal = await generateCustomSwal();
  await customSwal!.fire({
    title: "No playlist is selected!💢",
    text: "Please select at least one playlist!",
    type: "warning",
  });
};

const VideoListPanelBtnGroup = (props: VideoListPanelBtnGroupProps) => {
  const { checked: playlistIds, clearChecked, setViewPlaylist } = props;
  const preferDarkTheme = useSelector(selectPreferDarkTheme);
  const dispatch = useDispatch();

  const handleAddPlaylistToPlaying = useCallback(async () => {
    if (!playlistIds.length) {
      await noPlaylistSelectedAlert();
      return;
    }

    for (const playlistId of playlistIds) {
      dispatch(addNormPlaylistToNormListToPlayAction(playlistId));
    }

    // backward-compatible
    // DEPRECATED: remove after normalized states and actions are all stable (v4.0)
    dispatch(addPlaylistsToListToPlayAction(playlistIds));

    notify("success", "Successfully added selected playlist(s) to playing 😎");

    clearChecked();
  }, [clearChecked, dispatch, playlistIds]);

  const handleRemovePlaylistFromPlaying = useCallback(async () => {
    if (!playlistIds.length) {
      await noPlaylistSelectedAlert();
      return;
    }

    dispatch(removeNormPlaylistsFromNormListToPlayAction(playlistIds));

    // backward-compatible
    // DEPRECATED: remove after normalized states and actions are all stable (v4.0)
    dispatch(removePlaylistsFromListToPlayAction(playlistIds));

    clearChecked();
  }, [clearChecked, dispatch, playlistIds]);

  const handleDeletePlaylist = useCallback(async () => {
    const customSwal = await generateCustomSwal();

    if (!playlistIds.length) {
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
      playlistIds.forEach((playlistId) => {
        dispatch(deleteNormPlaylistByIdAction(playlistId));
      });

      // backward-compatible
      // DEPRECATED: remove after normalized states and actions are all stable (v4.0)
      dispatch(deletePlaylistsAction(playlistIds));

      notify("success", "Successfully deleted playlist(s) 😎");
      clearChecked();
    }
  }, [clearChecked, dispatch, playlistIds]);

  const handleViewPlaylist = useCallback(async () => {
    const customSwal = await generateCustomSwal();

    if (!playlistIds.length) {
      await noPlaylistSelectedAlert();
      return;
    }

    if (playlistIds.length > 1) {
      await customSwal!.fire({
        title: "You can only view one playlist at once",
        text: "Please select only one playlist!",
        type: "warning",
      });
      clearChecked();
      return;
    }

    setViewPlaylist(true);
  }, [playlistIds.length, clearChecked, setViewPlaylist]);

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
      <button onClick={handleDeletePlaylist} data-tooltip={"Remove playlist"}>
        <DeleteIcon />
      </button>
      <button onClick={handleViewPlaylist} data-tooltip={"View playlist"}>
        <ViewListIcon />
      </button>
    </div>
  );
};

export default VideoListPanelBtnGroup;
