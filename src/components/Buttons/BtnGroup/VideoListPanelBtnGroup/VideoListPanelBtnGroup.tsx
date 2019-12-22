import classNames from "classnames";
import { ClearChecked } from "components/Checkbox/hooks";
import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { selectPreferDarkTheme } from "store/userPreferences/selector";
import {
  generateCustomSwal,
  noPlaylistProvidedAlert,
} from "utils/helper/notifyHelper";
import {
  useAddPlaylistToPlaying,
  useDeletePlaylist,
  useRemovePlaylistFromPlaying,
} from "utils/hooks/playlistsHooks";

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

const VideoListPanelBtnGroup = (props: VideoListPanelBtnGroupProps) => {
  const { checked: playlistIds, clearChecked, setViewPlaylist } = props;
  const totalPlaylistsChecked = playlistIds.length;
  const preferDarkTheme = useSelector(selectPreferDarkTheme);

  // ==========================================
  // Handlers
  // ==========================================
  const { handleAddPlaylistToPlaying } = useAddPlaylistToPlaying(playlistIds);
  const { handleRemovePlaylistFromPlaying } = useRemovePlaylistFromPlaying(
    playlistIds
  );
  const { handleDeletePlaylist } = useDeletePlaylist(playlistIds);

  const handleViewPlaylist = useCallback(async () => {
    const customSwal = await generateCustomSwal();

    if (!totalPlaylistsChecked) {
      await noPlaylistProvidedAlert();
      return;
    }

    if (totalPlaylistsChecked > 1) {
      await customSwal!.fire({
        title: "You can only view one playlist at once",
        text: "Please select only one playlist!",
        icon: "warning",
      });
      clearChecked();
      return;
    }

    setViewPlaylist(true);
  }, [totalPlaylistsChecked, clearChecked, setViewPlaylist]);
  // ==========================================
  // End handlers
  // ==========================================

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
