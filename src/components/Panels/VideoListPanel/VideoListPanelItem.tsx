import classNames from "classnames";
import { HandleCheckOrUncheckId } from "components/Checkbox/hooks";
import {
  AllPlaylistInPlayingIcon,
  PartialPlaylistInPlayingIcon,
} from "components/Icons";
import { RenameInput } from "components/Inputs";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "store";
import {
  selectPlaylistAllInPlayingById,
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
  handleCheckOrUncheckId: HandleCheckOrUncheckId;
}

const VideoListPanelItem = (props: VideoListPanelItemProps) => {
  const { playlistId, checked, handleCheckOrUncheckId } = props;
  const allInPlaying = useSelector((state: AppState) =>
    selectPlaylistAllInPlayingById(state, playlistId)
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
      <div onClick={handleCheckOrUncheckId(playlistId)}>
        <Checkbox
          className={styles.checkBox}
          checked={checked.includes(playlistId)}
          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
          checkedIcon={<CheckBoxIcon fontSize="small" />}
          onChange={handleCheckOrUncheckId(playlistId)}
        />
        <RenameInput
          id={playlistId}
          handleCheckOrUncheckId={handleCheckOrUncheckId}
        />

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
