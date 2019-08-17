import classNames from "classnames";
import { HandleSetChecked } from "components/Checkbox/hooks";
import {
  AllPlaylistInPlayingIcon,
  PartialPlaylistInPlayingIcon,
} from "components/Icons";
import { RenameInput } from "components/Inputs";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "store";
import {
  selectNormPlaylistAllInPlayingById,
  selectPartialInPlayingById,
} from "store/ytplaylist/playlistSelectors";

import { Checkbox } from "@material-ui/core";
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from "@material-ui/icons";

import styles from "./styles.module.scss";

interface VideoListPanelItemProps {
  playlistId: string;
  checked: string[];
  handleSetChecked: HandleSetChecked;
}

const VideoListPanelItem = (props: VideoListPanelItemProps) => {
  const { playlistId, checked, handleSetChecked } = props;
  const allInPlaying = useSelector((state: AppState) =>
    selectNormPlaylistAllInPlayingById(state, playlistId)
  );
  const partialInPlaying = useSelector((state: AppState) =>
    selectPartialInPlayingById(state, playlistId)
  );

  return (
    <div
      key={playlistId}
      className={classNames(styles.videoListItem, {
        [styles.checkedPlaylists]: checked.includes(playlistId),
      })}
    >
      <div onClick={handleSetChecked(playlistId)}>
        <Checkbox
          className={styles.checkBox}
          checked={checked.includes(playlistId)}
          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
          checkedIcon={<CheckBoxIcon fontSize="small" />}
          onChange={handleSetChecked(playlistId)}
        />
        <RenameInput id={playlistId} handleSetChecked={handleSetChecked} />

        {allInPlaying ? (
          <AllPlaylistInPlayingIcon />
        ) : partialInPlaying ? (
          <PartialPlaylistInPlayingIcon />
        ) : null}
      </div>
    </div>
  );
};

export default VideoListPanelItem;
